module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const Category = app.model.define(
    "category",
    {
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      total: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unfinish: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      deletedAt: {
        type: DATE,
        get() {
          return new Date(this.getDataValue("deletedAt")).getTime();
        },
      },
    },
    {
      tableName: "categories",
      paranoid: true,
    }
  );

  Category.associate = function () {
    app.model.Category.belongsTo(app.model.User, {
      as: "user",
      foreignKey: "userId",
    });
  };
  return Category;
};
