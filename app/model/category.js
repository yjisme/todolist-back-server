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
          if (this.getDataValue("deletedAt")) {
            return new Date(this.getDataValue("deletedAt")).getTime();
          }
          return null;
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
