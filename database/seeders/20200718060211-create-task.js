"use strict";

function getRandom(min, max) {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
}

function getDataOrNull(data) {
  return Math.random() < 0.3 ? null : data;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tasks = [];

    for (var i = 1; i <= 10000; i++) {
      const userId = Math.ceil(i / 100);
      const cateMaxId = userId * 10;
      const cateMinId = cateMaxId - 9;
      const categoryId = getDataOrNull(getRandom(cateMinId, cateMaxId));
      const deadLineDistance = 20; // deadLine的间隔
      const deadLine = getDataOrNull(
        getRandom(
          Date.now() - deadLineDistance * 3600 * 1000 * 24,
          Date.now() + deadLineDistance * 3600 * 1000 * 24
        )
      );
      const urgencyMinute = getRandom(10, 100);
      const createdAt = getRandom(
        Date.now() - deadLineDistance * 3600 * 1000 * 24,
        Date.now()
      );
      const updatedAt = createdAt;
      const finishDate = getDataOrNull(getRandom(createdAt, Date.now()));
      const deletedAt = getDataOrNull(getRandom(createdAt, Date.now()));
      const t = {
        id: i,
        userId,
        categoryId,
        title: `测试任务${i}`,
        remark: getDataOrNull(`测试任务${i}的备注`),
        deadLine: deadLine ? new Date(deadLine) : null,
        urgencyMinute,
        finishDate: finishDate ? new Date(finishDate) : null,
        createdAt: createdAt ? new Date(createdAt) : null,
        updatedAt: updatedAt ? new Date(updatedAt) : null,
        deletedAt: deletedAt ? new Date(deletedAt) : null,
      };
      tasks.push(t);
    }
    await queryInterface.bulkInsert("tasks", tasks);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tasks", {});
  },
};
