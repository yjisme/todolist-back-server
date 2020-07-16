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
      isAdmin: [
        {
          type: "boolean",
        },
      ],
    };
  }

  /**
   * 添加一个用户
   * @param {{
   * loginId:string,
   * loginPwd:string,
   * email:string,
   * isAdmin: boolean
   * }} userInfo
   */
  async addUser(userInfo) {
    userInfo = this.ctx.helper.pick(
      userInfo,
      "loginId",
      "loginPwd",
      "email",
      "isAdmin"
    );
    userInfo = this.ctx.helper.trim(userInfo, "loginId", "loginPwd", "email");
    const rule = this._getAddUserValidateRule();
    await this.ctx.helper.validate(userInfo, rule);
    // 处理密码
    userInfo.loginPwd = this.ctx.helper.md5(userInfo.loginPwd);
    // 启用用户
    userInfo.enable = true;
    return await this.app.model.User.create(userInfo);
  }

  /**
   * 登录成功返回用户对象，登录失败，返回null
   * @param {{loginId: string, loginPwd:string}} loginInfo 登录信息对象，包含账号或邮箱、密码
   */
  async login(loginInfo) {
    loginInfo = this.ctx.helper.pick(loginInfo, "loginId", "loginPwd");
    loginInfo = this.ctx.helper.trim(loginInfo, "loginId", "loginPwd");
    loginInfo.loginPwd = this.ctx.helper.md5(loginInfo.loginPwd);
    const u = await this.app.model.User.findOne({
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
    if (!u || u.enable) {
      return u;
    }
    throw new this.ctx.helper.ValidateError("this accout is not enable", 403);
  }

  /**
   * 获取多个用户对象
   */
  async getUsers(page = 1, limit = 10, filter = {}, order = []) {
    return await this.app.model.User.findAndCountAll({
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
    return true;
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
