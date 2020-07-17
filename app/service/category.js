const Service = require("egg").Service;

module.exports = class extends Service {
  /**
   * 添加一个分类
   * TODO:要限制一下每个用户最多的分类数量，考虑该数量是否需要在后台配置
   * @param {*} categoryInfo
   */
  async addCategory(categoryInfo) {
    categoryInfo = this.helper.pick(categoryInfo, "user", "name");
    categoryInfo = this.helper.trim(categoryInfo, "name");
    const rule = {
      user: [
        {
          required: true,
        },
        {
          type: "integer",
        },
      ],
      name: [
        {
          required: true,
        },
        {
          type: "string",
        },
      ],
    };
    await this.helper.validate(categoryInfo, rule);
    return await this.model.TaskCategory.create(categoryInfo);
  }

  async updateCategory(id, categoryInfo) {
    categoryInfo = this.helper.pick(categoryInfo, "name", "order");
    categoryInfo = this.helper.trim(categoryInfo, "name");
    const rule = {
      name: [
        {
          type: "string",
        },
      ],
    };
    await this.helper.validate(categoryInfo, rule);
    await this.model.TaskCategory.update(categoryInfo, {
      where: {
        id,
      },
    });
  }

  async deleteCategory(id) {
    await this.model.TaskCategory.destroy({
      where: {
        id,
      },
    });
    await this.model.Task.destroy({
      where: {
        category: id,
      },
    });
  }

  /**
   * 获取某个用户的所有分类
   * @param {*} userId
   * @returns {{name, total, unfinish, ... }}
   */
  async getAllCategory(userId) {
    return await this.model.TaskCategory.findAll({
      where: {
        user: userId,
      },
    });
  }
};
