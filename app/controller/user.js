const Controller = require("egg").Controller;
require("sequelize").Op;
module.exports = class extends Controller {
  async getUsers() {
    const filter = {};
    if (this.ctx.query.keyword) {
      filter[this.app.Op.or] = [
        {
          loginId: {
            [this.app.Op.like]: `%${this.ctx.query.keyword}%`,
          },
        },
        {
          email: {
            [this.app.Op.like]: `%${this.ctx.query.keyword}%`,
          },
        },
      ];
    }
    if (typeof this.ctx.query.enable !== "undefined") {
      const enable = !!+this.ctx.query.enable;
      filter.enable = enable;
    }
    if (typeof this.ctx.query.isadmin !== "undefined") {
      const isadmin = !!+this.ctx.query.isadmin;
      filter.isAdmin = isadmin;
    }
    const order = [["createdAt", "DESC"]];
    this.ctx.body = await this.service.user.getUsers(
      this.ctx.query.page,
      this.ctx.query.limit,
      filter,
      order
    );
  }
};
