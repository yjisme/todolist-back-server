const Controller = require("egg").Controller;

module.exports = class extends Controller {
  async addCategory() {
    this.ctx.request.body.userId = +this.ctx.params.userId;
    this.ctx.body = await this.service.category.addCategory(
      this.ctx.request.body
    );
  }

  async updateCategory() {
    this.ctx.body = await this.service.category.updateCategory(
      this.ctx.params.userId,
      this.ctx.params.id,
      this.ctx.request.body
    );
  }

  async deleteCategory() {
    this.ctx.body = await this.service.category.deleteCategory(
      this.ctx.params.userId,
      this.ctx.params.id
    );
  }

  async getAllCategory() {
    this.ctx.body = await this.service.category.getAllCategory(
      this.ctx.params.userId
    );
  }
};
