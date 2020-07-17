module.exports = (app) => {
  const { STRING, DATE, BOOLEAN } = app.Sequelize;

  const User = app.model.define(
    "user",
    {
      loginId: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      loginPwd: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      isAdmin: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      enable: {
        type: BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        type: DATE,
        get() {
          return new Date(this.getDataValue("createdAt")).getTime();
        },
      },
      updatedAt: {
        type: DATE,
        get() {
          return new Date(this.getDataValue("updatedAt")).getTime();
        },
      },
    },
    {
      tableName: "users",
      defaultScope: {
        attributes: {
          exclude: ["loginPwd"],
        },
      },
    }
  );

  User.prototype.toJSON = function () {
    const obj = this.get();
    delete obj.loginPwd;
    return obj;
  };
  return User;
};
