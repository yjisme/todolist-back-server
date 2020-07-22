const Service = require("egg").Service;

module.exports = class extends Service {
  /**
   * 添加一个分类
   * @param {*} categoryInfo
   */
  async addCategory(categoryInfo) {
    categoryInfo = this.ctx.helper.pick(categoryInfo, "userId", "name");
    categoryInfo = this.ctx.helper.trim(categoryInfo, "name");
    const rule = {
      userId: [
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
    await this.ctx.helper.validate(categoryInfo, rule);
    // 验证数量
    const cateNumber = await this.app.model.Category.count({
      where: {
        userId: categoryInfo.userId,
      },
    });
    const setting = await this.service.setting.getSetting();
    if (cateNumber >= setting.maxCategoryNumber) {
      throw new this.ctx.helper.ValidateError(
        `用户的分类数量不能超过设置的分类数量，目前该用户的分类数量是${cateNumber}，设置的最大分类数量是${setting.maxCategoryNumber}`
      );
    }
    return await this.app.model.Category.create(categoryInfo);
  }

  /**
   * 修改一个分类，仅可修改分类的名称
   * @param {*} id
   * @param {*} categoryInfo
   */
  async updateCategory(id, categoryInfo) {
    categoryInfo = this.ctx.helper.pick(categoryInfo, "name");
    categoryInfo = this.ctx.helper.trim(categoryInfo, "name");
    const rule = {
      name: [
        {
          type: "string",
        },
      ],
    };
    await this.ctx.helper.validate(categoryInfo, rule);
    await this.app.model.Category.update(categoryInfo, {
      where: {
        id,
      },
    });
    return true;
  }

  // TODO:需要检查是否是该用户的
  async deleteCategory(id) {
    await this.app.model.Category.destroy({
      where: {
        id,
      },
    });

    // 无须删除其下任务，这些任务的分类自动变为空
    // await this.app.model.Task.destroy({
    //   where: {
    //     categoryId: id,
    //   },
    // });
    return true;
  }

  /**
   * 获取某个用户的所有分类
   * @param {*} userId
   * @returns {{name,... }}
   */
  async getAllCategory(userId) {
    return await this.app.model.Category.findAll({
      where: {
        userId,
      },
    });
  }

  async isMatch(userId, cateId) {
    const cate = await this.app.model.Category.findByPk(cateId);
    if (!cate) {
      return false;
    }
    console.log(cate.userId, userId, cate.userId === userId);
    return cate.userId === userId;
  }
};
