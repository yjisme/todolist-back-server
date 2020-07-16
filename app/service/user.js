const Service = require("egg").Service;

module.exports = class extends Service {
  /**
   * 获取添加用户的验证规则
   */
  _getAddUserValidateRule() {
    return {
      loginId: [
        {
          required: true,
        },
        {
          type: "string",
        },
        {
          asyncValidator: async (rule, value) => {
            const u = await this.getUserByLoginId(value);
            if (u) {
              throw "loginId is existing";
            }
          },
        },
      ],
      loginPwd: [
        {
          required: true,
        },
        {
          type: "string",
        },
      ],
      email: [
        {
          required: true,
        },
        {
          type: "email",
        },
        {
          asyncValidator: async (rule, value) => {
            const u = await this.getUserByEmail(value);
            if (u) {
              throw "email is existing";
            }
          },
        },
      ],
    };
  }

  /**
   * 添加一个用户
   * TODO:启动后要自动添加一个管理员用户
   * @param {{
   * loginId:string,
   * loginPwd:string,
   * email:string
   * }} userInfo
   */
  async _addUser(userInfo, isAdmin) {
    userInfo = this.ctx.helper.pick(userInfo, "loginId", "loginPwd", "email");
    userInfo = this.ctx.helper.trim(userInfo, "loginId", "loginPwd", "email");
    const rule = this._getAddUserValidateRule();
    await this.ctx.helper.validate(userInfo, rule);
    // 处理角色
    userInfo.role = isAdmin
      ? this.app.model.User.ROLE_ADMIN
      : this.app.model.User.ROLE_NORMAL;
    // 处理密码
    userInfo.loginPwd = this.ctx.helper.md5(userInfo.loginPwd);
    // 启用用户
    userInfo.enable = true;
    return await this.app.model.User.create(userInfo);
  }

  /**
   * 注册用户
   * @param {{
   * loginId:string,
   * loginPwd:string,
   * email:string
   * }} userInfo
   */
  async reg(userInfo) {
    return await this._addUser(userInfo, false);
  }

  /**
   * 添加管理员
   * @param {{
   * loginId:string,
   * loginPwd:string,
   * email:string
   * }} userInfo
   */
  async addAdmin(userInfo) {
    return await this._addUser(userInfo, true);
  }

  /**
   * 根据登录信息查询用户对象，登录成功返回用户对象，登录失败，返回null
   * TODO:注意，这里的登录不会考虑用户是否被禁用的情况，这种情况需要在上层处理
   * @param {{loginId: string, loginPwd:string}} loginInfo 登录信息对象，包含账号或邮箱、密码
   */
  async getUserByLoginInfo(loginInfo) {
    loginInfo = this.ctx.helper.pick(loginInfo, "loginId", "loginPwd");
    loginInfo = this.ctx.helper.trim(loginInfo, "loginId", "loginPwd");
    loginInfo.loginPwd = this.ctx.helper.md5(loginInfo.loginPwd);
    return await this.app.model.User.findOne({
      where: {
        [this.app.Sequelize.Op.or]: [
          {
            loginId: loginInfo.loginId,
            loginPwd: loginInfo.loginPwd,
          },
          {
            email: loginInfo.loginId,
            loginPwd: loginInfo.loginPwd,
          },
        ],
      },
    });
  }

  /**
   * 获取多个用户对象
   */
  async getUsers(page = 1, limit = 10, filter = {}, order = []) {
    return await this.app.model.User.findAndCountAll({
      attributes: {
        exclude: ["loginPwd"],
      },
      where: filter,
      order,
      offset: (page - 1) * limit,
      limit: +limit,
    });
  }

  _getUpdateUserValidateRule(curUserId) {
    return {
      email: [
        {
          type: "email",
        },
        {
          asyncValidator: async (rule, value) => {
            if (!value) {
              return;
            }
            const number = await this.app.model.User.count({
              where: {
                id: {
                  [this.app.Sequelize.Op.ne]: curUserId,
                },
                email: value,
              },
            });
            if (number) {
              throw "email is existing";
            }
          },
        },
      ],
    };
  }

  /**
   * 更新用户信息
   * @param {int} id 编号
   * @param {*} newInfo 新的用户信息
   */
  async updateUser(id, newInfo) {
    newInfo = this.ctx.helper.pick(newInfo, "email", "enable", "loginPwd");
    newInfo = this.ctx.helper.trim(newInfo, "email", "loginPwd");
    const rule = this._getUpdateUserValidateRule(id);
    await this.ctx.helper.validate(newInfo, rule);
    await this.app.model.User.update(newInfo, {
      where: {
        id,
      },
    });
  }

  async getUserByLoginId(loginId) {
    return await this.app.model.User.findOne({
      where: {
        loginId,
      },
    });
  }

  async getUserByEmail(email) {
    return await this.app.model.User.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(id) {
    return await this.app.model.User.findByPk(id);
  }
};
