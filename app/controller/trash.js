const Controller = require("egg").Controller;

module.exports = class extends Controller {
  async getTrashes() {
    let page = +this.ctx.query.page;
    let limit = +this.ctx.query.limit;
    page = page || 1;
    limit = limit || 30;
    this.ctx.body = await this.service.trash.getTrashes(
      this.ctx.params.userId,
      page,
      limit
    );
  }

  async restoreTrashes() {
    this.ctx.body = await this.service.trash.restore(
      this.ctx.params.userId,
      this.ctx.request.body
    );
  }

  async deleteTrashes() {
    this.ctx.body = await this.service.trash.delete(
      this.ctx.params.userId,
      this.ctx.request.body
    );
  }
};
