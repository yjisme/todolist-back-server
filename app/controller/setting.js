const Controller = require("egg").Controller;

module.exports = class extends Controller {
  async getSetting() {
    this.ctx.body = await this.service.setting.getSetting();
  }

  async setSetting() {
    this.ctx.body = await this.service.setting.setSetting(
      this.ctx.request.body
    );
  }
};
