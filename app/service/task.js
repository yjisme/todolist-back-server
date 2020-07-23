const Service = require("egg").Service;
const moment = require("moment");
const { QueryTypes } = require("sequelize");

module.exports = class extends Service {
  _getExtraOption() {
    return {
      include: {
        model: this.app.model.Category,
        as: "category",
        attributes: ["name"],
      },
      order: [
        ["deadLine", "ASC"],
        ["id", "ASC"],
      ],
    };
  }
  _getTomorrowBegin() {
    let tomorrowBegin = Date.now() + 3600 * 24 * 1000;
    tomorrowBegin = new Date(tomorrowBegin);
    tomorrowBegin.setHours(0, 0, 0, 0);
    return tomorrowBegin;
  }
  _getTodayBegin() {
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }
  /**
   * 获取今日的任务
   * 这样的任务特点：
   * - 具有deadLine
   * - deadLine 日期等于今日
   */
  async getTodayTasks(userId) {
    const todayBegin = this._getTodayBegin();
    const tomorrowBegin = this._getTomorrowBegin();
    const Op = this.app.Sequelize.Op;
    return await this.app.model.Task.findAll({
      where: {
        userId,
        deadLine: {
          [Op.lt]: tomorrowBegin,
          [Op.gte]: todayBegin,
          [Op.not]: null,
        },
        finishDate: {
          [Op.is]: null,
        },
      },
      ...this._getExtraOption(),
    });
  }

  async searchTask(userId, keyword, page = 1, limit = 30) {
    const Op = this.app.Sequelize.Op;
    return await this.app.model.Task.findAndCountAll({
      where: {
        userId,
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            remark: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      offset: (page - 1) * limit,
      limit,
      ...this._getExtraOption(),
    });
  }

  /**
   * 获取将来的任务
   * 这样的任务特点：
   * - 具有deadLine
   * - deadLine 日期大于今日
   * @param {*} userId
   * @returns {{
   *  "year-month-day": [
   *  {任务对象},
   *  {任务对象}
   * ]
   * ...
   * }}
   */
  async getFutureTasks(userId) {
    let tomorrowBegin = this._getTomorrowBegin();
    const Op = this.app.Sequelize.Op;
    let tasks = await this.app.model.Task.findAll({
      where: {
        userId,
        deadLine: {
          [Op.gte]: tomorrowBegin,
        },
        finishDate: {
          [Op.is]: null,
        },
      },
      ...this._getExtraOption(),
    });
    const result = {};
    for (const task of tasks) {
      const dateStr = moment(task.deadLine).format("YYYY-MM-DD");
      if (result[dateStr]) {
        result[dateStr].push(task);
      } else {
        result[dateStr] = [task];
      }
    }
    return result;
  }

  /**
   * 获取过期的任务
   * - 过期
   * - 未完成
   * @param {*} userId
   */
  async getPassTasks(userId) {
    const Op = this.app.Sequelize.Op;
    return await this.app.model.Task.findAll({
      where: {
        userId,
        deadLine: {
          [Op.not]: null,
          [Op.lte]: Date.now(),
        },
        finishDate: {
          [Op.is]: null,
        },
      },
      ...this._getExtraOption(),
    });
  }

  /**
   * 获取紧急任务
   * - 未完成 finishDate is null
   * - deadLine有值
   * - deadLine>now
   * - deadLine-now <= urgencyMinute
   * @param {*} userId
   */
  async getUrgencyTasks(userId) {
    const Sequelize = this.app.Sequelize;
    const Op = Sequelize.Op;
    const now = Date.now() / 1000;
    return await this.app.model.Task.findAll({
      where: {
        [Op.and]: [
          { userId },
          {
            deadLine: {
              [Op.not]: null,
              [Op.gte]: Date.now(),
            },
          },
          {
            finishDate: {
              [Op.is]: null,
            },
          },
          Sequelize.where(
            Sequelize.literal(`UNIX_TIMESTAMP(deadLine) - ${now}`),
            {
              [Op.lte]: Sequelize.literal(`urgencyMinute*60`),
            }
          ),
        ],
      },
      ...this._getExtraOption(),
    });
  }

  /**
   * 获取日志薄
   * - 已完成 finishDate is not null
   * @param {*} userId
   * @returns {{
   *  "year-month": [
   *  {任务对象},
   *  {任务对象}
   * ]
   * ...
   * }}
   */
  async getNoteBook(userId, page = 1, limit = 30) {
    const Op = this.app.Sequelize.Op;
    let tasks = await this.app.model.Task.findAndCountAll({
      where: {
        userId,
        finishDate: {
          [Op.not]: null,
        },
      },
      ...this._getExtraOption(),
      order: [
        ["finishDate", "ASC"],
        ["id", "ASC"],
      ],
      offset: (page - 1) * limit,
      limit: +limit,
    });
    const result = {};
    for (const task of tasks.rows) {
      const dateStr = moment(task.finishDate).format("YYYY-MM");
      if (result[dateStr]) {
        result[dateStr].push(task);
      } else {
        result[dateStr] = [task];
      }
    }
    return {
      count: tasks.count,
      data: result,
    };
  }

  /**
   * 按照分类获取日志
   * - 未完成
   * @param {*} categoryId
   */
  async getTasks(userId, categoryId) {
    const isMatch = await this.service.category.isMatch(+userId, +categoryId);
    if (!isMatch) {
      return [];
    }
    const Op = this.app.Sequelize.Op;
    return await this.app.model.Task.findAll({
      where: {
        categoryId,
        finishDate: {
          [Op.is]: null,
        },
      },
      ...this._getExtraOption(),
    });
  }

  async getSummary(userId) {
    const result = {
      summary: {},
      category: {},
    };
    const proms = [
      this.getTodayTasks(userId), //今日任务
      this.getNoteBook(userId, 1, 1), //日志薄
      this.getPassTasks(userId), //过期任务
      this.getUrgencyTasks(userId), //紧急任务
      this.getFutureTasks(userId), //未来计划
    ];
    const promResults = await Promise.all(proms);
    result.summary.today = promResults[0].length;
    result.summary.noteBook = promResults[1].count;
    result.summary.pass = promResults[2].length;
    result.summary.urgency = promResults[3].length;
    result.summary.schedule = Object.values(promResults[4]).reduce(
      (a, b) => a + b.length,
      0
    );
    const sql = `SELECT
    id,
    ( SELECT COUNT( id ) FROM ${this.app.model.Task.tableName}  WHERE categoryId = ${this.app.model.Category.tableName} .id AND deletedAt IS NULL AND finishDate IS NULL ) AS number 
  FROM
    ${this.app.model.Category.tableName} 
  WHERE
    userId = ? 
    AND deletedAt IS NULL`;
    let categorySummary = await this.app.model.Task.sequelize.query(sql, {
      replacements: [userId],
      type: QueryTypes.SELECT,
    });
    categorySummary = categorySummary.map(({ id, number }) => [id, number]);
    categorySummary = Object.fromEntries(categorySummary);
    result.category = categorySummary;
    return result;
  }

  /**
   * 获取添加任务的验证规则
   */
  _getAddTaskValidateRule() {
    return {
      userId: [
        {
          required: true,
        },
        {
          type: "integer",
        },
      ],
      categoryId: [
        {
          type: "integer",
        },
      ],
      title: [
        {
          required: true,
        },
        {
          type: "string",
        },
      ],
      remark: [
        {
          type: "string",
        },
      ],
      deadLine: [
        {
          type: "integer",
        },
      ],
      urgencyMinute: [
        {
          type: "integer",
          min: 1,
        },
      ],
    };
  }
  async addTask(taskInfo) {
    taskInfo = this.ctx.helper.pick(
      taskInfo,
      "userId",
      "categoryId",
      "title",
      "remark",
      "deadLine",
      "urgencyMinute"
    );
    taskInfo = this.ctx.helper.trim(taskInfo, "title", "remark");
    const rule = this._getAddTaskValidateRule();
    await this.ctx.helper.validate(taskInfo, rule);
    const setting = await this.service.setting.getSetting();
    // 查看是否和用户匹配
    if (taskInfo.categoryId !== undefined && taskInfo.categoryId !== null) {
      const isMatch = await this.service.category.isMatch(
        taskInfo.userId,
        taskInfo.categoryId
      );
      if (!isMatch) {
        throw new this.ctx.helper.ValidateError([
          {
            message: "category is not exits",
            field: "categoryId",
          },
        ]);
      }
    }
    // 默认紧急时间
    if (!taskInfo.urgencyMinute) {
      taskInfo.urgencyMinute = setting.urgencyMinute;
    }
    return await this.app.model.Task.create(taskInfo);
  }

  /**
   * 获取添加任务的验证规则
   */
  _getUpdateTaskValidateRule() {
    return {
      categoryId: [
        {
          type: "integer",
        },
      ],
      title: [
        {
          type: "string",
        },
      ],
      remark: [
        {
          type: "string",
        },
      ],
      deadLine: [
        {
          type: "integer",
        },
      ],
      urgencyMinute: [
        {
          type: "integer",
          min: 1,
        },
      ],
    };
  }
  async updateTask(userId, taskId, taskInfo) {
    // 任务是否属于该用户
    const t = await this.app.model.Task.findByPk(taskId);
    if (!t || t.userId !== userId) {
      throw new this.ctx.helper.ValidateError("task is not exits");
    }
    taskInfo = this.ctx.helper.pick(
      taskInfo,
      "categoryId",
      "title",
      "remark",
      "deadLine",
      "urgencyMinute"
    );
    taskInfo = this.ctx.helper.trim(taskInfo, "title", "remark");
    const rule = this._getUpdateTaskValidateRule();
    await this.ctx.helper.validate(taskInfo, rule);
    // 类别是否属于该用户
    if (taskInfo.categoryId !== undefined && taskInfo.categoryId !== null) {
      const isMatch = await this.service.category.isMatch(
        userId,
        taskInfo.categoryId
      );
      if (!isMatch) {
        throw new this.ctx.helper.ValidateError([
          {
            message: "category is not exits",
            field: "categoryId",
          },
        ]);
      }
    }
    await this.app.model.Task.update(taskInfo, {
      where: {
        id: taskId,
      },
    });
    return true;
  }

  async deleteTask(userId, taskId) {
    const t = await this.app.model.Task.findByPk(taskId);
    if (!t || t.userId !== userId) {
      throw new this.ctx.helper.ValidateError("task is not exits");
    }
    await this.app.model.Task.destroy({
      where: {
        id: taskId,
      },
    });
    return true;
  }
};
