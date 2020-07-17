module.exports = (app) => {
  const { STRING } = app.Sequelize;

  const Setting = app.model.define(
    "setting",
    {
      key: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: "settings",
      timestamps: false,
    }
  );
  return Setting;
};
