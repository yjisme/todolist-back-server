const Controller = require("egg").Controller;

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

  async addUser() {
    this.ctx.body = await this.service.user.addUser(this.ctx.request.body);
  }

  async login() {
    this.ctx.body = await this.service.user.login(this.ctx.request.body);
  }

  async update() {
    this.ctx.body = await this.service.user.updateUser(
      this.ctx.params.id,
      this.ctx.request.body
    );
  }

  async getUser() {
    let u = null;
    if (this.ctx.query.id) {
      u = await this.service.user.getUserById(this.ctx.query.id);
    } else if (this.ctx.query.email) {
      u = await this.service.user.getUserByEmail(this.ctx.query.email);
    } else if (this.ctx.query.loginid) {
      u = await this.service.user.getUserByLoginId(this.ctx.query.loginid);
    }
    this.ctx.body = u;
  }
};
