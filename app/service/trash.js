const Service = require("egg").Service;
const { QueryTypes } = require("sequelize");
module.exports = class extends Service {
  async getTrashes(userId, page = 1, limit = 30) {
    const sql = `SELECT * FROM
    (( SELECT id, 'category' AS type, \`name\`, UNIX_TIMESTAMP(deletedAt) * 1000 AS deletedAt FROM ${this.app.model.Category.tableName} WHERE deletedAt IS NOT NULL AND userId = ? ) UNION
    (
      SELECT
        id,
        'task' AS type,
        title AS \`name\`,
        UNIX_TIMESTAMP(deletedAt) * 1000 AS deletedAt 
      FROM
      ${this.app.model.Task.tableName} 
      WHERE
      deletedAt IS NOT NULL 
      AND userId = ?)) AS trash
      ORDER BY deletedAt DESC
      LIMIT ?,?`;
    const row = await this.app.model.Task.sequelize.query(sql, {
      replacements: [userId, userId, (page - 1) * limit, limit],
      type: QueryTypes.SELECT,
    });
    const Op = this.app.Sequelize.Op;
    const proms = [
      this.app.model.Category.count({
        paranoid: false,
        where: {
          deletedAt: {
            [Op.not]: null,
          },
          userId,
        },
      }),
      this.app.model.Task.count({
        paranoid: false,
        where: {
          deletedAt: {
            [Op.not]: null,
          },
          userId,
        },
      }),
    ];
    const [cateNumber, taskNumber] = await Promise.all(proms);
    return {
      count: cateNumber + taskNumber,
      row,
    };
  }

  /**
   * 恢复数据
   * @param {*} userId
   * @param {[{id: number, type: "category"|"task"}]} restoreIds
   */
  async restore(userId, restoreIds = []) {
    const categoryIds = restoreIds
      .filter((it) => it.type === "category")
      .map((it) => it.id);
    const taskIds = restoreIds
      .filter((it) => it.type === "task")
      .map((it) => it.id);
    const Op = this.app.Sequelize.Op;
    const prom1 = this.app.model.Category.restore({
      where: {
        userId,
        id: {
          [Op.in]: categoryIds,
        },
      },
    });
    const prom2 = this.app.model.Task.restore({
      where: {
        userId,
        id: {
          [Op.in]: taskIds,
        },
      },
    });
    await Promise.all([prom1, prom2]);
    return true;
  }

  async delete(userId, deleteIds = []) {
    let categoryIds = deleteIds
      .filter((it) => it.type === "category")
      .map((it) => it.id);
    let taskIds = deleteIds
      .filter((it) => it.type === "task")
      .map((it) => it.id);
    const Op = this.app.Sequelize.Op;

    // 由于category中可能包含有task，因此，删除category的行为需要特别注意
    // 获取要真正删除的categoryId
    categoryIds = await this.app.model.Category.findAll({
      attributes: ["id"],
      where: {
        userId,
        id: {
          [Op.in]: categoryIds,
        },
        deletedAt: {
          [Op.not]: null,
        },
      },
      paranoid: false,
    });
    categoryIds = categoryIds.map((it) => it.id);
    // 设置该分类下，所有的task的分类为null
    await this.app.model.Task.update(
      { categoryId: null },
      {
        where: {
          categoryId: {
            [Op.in]: categoryIds,
          },
        },
        paranoid: false,
      }
    );
    // 删除分类
    await this.app.model.Category.destroy({
      where: {
        id: {
          [Op.in]: categoryIds,
        },
      },
      force: true,
    });
    // 删除任务
    await this.app.model.Task.destroy({
      where: {
        userId,
        id: {
          [Op.in]: taskIds,
        },
      },
      force: true,
    });

    return true;
  }
};
