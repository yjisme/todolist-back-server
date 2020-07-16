const md5 = require("md5");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [];
    for (var i = 1; i <= 1000; i++) {
      categories.push({
        id: i,
        userId: Math.floor(Math.random() * 99) + 1,
        name: `测试分类${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("categories", categories);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", {});
  },
};
