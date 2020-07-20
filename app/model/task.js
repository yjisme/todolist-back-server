module.exports = (app) => {
  const { INTEGER, STRING, DATE, VIRTUAL } = app.Sequelize;

  const Task = app.model.define(
    "task",
    {
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: INTEGER,
        allowNull: true,
      },
      title: {
        type: STRING,
        allowNull: false,
      },
      remark: {
        // 备注
        type: STRING(1000),
        allowNull: true,
      },
      deadLine: {
        // 期限
        type: DATE,
        allowNull: true,
        get() {
          if (this.getDataValue("deadLine")) {
            return new Date(this.getDataValue("deadLine")).getTime();
          }
          return null;
        },
      },
      urgencyMinute: {
        // 未完成的任务，距离期限多少分钟内会进入紧急状态
        type: INTEGER,
        allowNull: false,
      },
      finishDate: {
        type: DATE,
        allowNull: true,
        get() {
          if (this.getDataValue("finishDate")) {
            return new Date(this.getDataValue("finishDate")).getTime();
          }
          return null;
        },
      },
      isFinish: {
        type: VIRTUAL,
        get() {
          return !!this.finishDate;
        },
      },
      isUrgency: {
        type: VIRTUAL,
        get() {
          if (this.isPass) {
            return false;
          }
          if (this.isFinish) {
            return false;
          }
          if (this.deadLine) {
            const diff = new Date(this.deadLine).getTime() - Date.now();
            if (diff <= this.urgencyMinute * 60 * 1000) {
              return true;
            }
          }
          return false;
        },
      },
      isPass: {
        type: VIRTUAL,
        get() {
          if (this.deadLine) {
            const diff = new Date(this.deadLine).getTime() - Date.now();
            if (diff <= 0) {
              return true;
            }
          }
          return false;
        },
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
      tableName: "tasks",
      paranoid: true,
    }
  );

  Task.associate = function () {
    app.model.Task.belongsTo(app.model.User, {
      as: "user",
      foreignKey: "userId",
    });

    app.model.Task.belongsTo(app.model.Category, {
      as: "category",
      foreignKey: "categoryId",
    });
  };

  return Task;
};
