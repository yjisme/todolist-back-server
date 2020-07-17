module.exports = class {
  constructor(app) {
    this.app = app;
  }

  async didReady() {
    // 初始化数据库
    await this._initAdmin();
  }

  async _initAdmin() {
    const ctx = await this.app.createAnonymousContext();
    const u = await ctx.service.user.getUserByLoginId("admin");
    if (!u) {
      // 添加用户
      const admin = await ctx.service.user.addUser({
        loginId: "admin",
        loginPwd: "123456",
        isAdmin: true,
        email: `${ctx.helper.getRandomString(6)}@${ctx.helper.getRandomString(
          3
        )}.com`,
      });
      this.app.logger.info("管理员已添加 %j", admin);
    }
  }
};
