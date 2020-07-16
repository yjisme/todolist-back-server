module.exports = (app) => {
  const { STRING, DATE, BOOLEAN } = app.Sequelize;

  const User = app.model.define(
    "user",
    {
      loginId: {
        type: STRING,
        allowNull: false,
        unique: true,
        field: "loginId",
      },
      loginPwd: {
        type: STRING,
        allowNull: false,
        field: "loginPwd",
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
        field: "isAdmin",
      },
      enable: {
        type: BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        type: DATE,
        field: "createdAt",
        get() {
          return new Date(this.getDataValue("createdAt")).getTime();
        },
      },
      updatedAt: {
        type: DATE,
        field: "updatedAt",
        get() {
          return new Date(this.getDataValue("updatedAt")).getTime();
        },
      },
    },
    {
      tableName: "users",
    }
  );
  return User;
};
