const md5 = require("md5");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (var i = 1; i <= 100; i++) {
      users.push({
        id: i,
        loginId: `account${i}`,
        loginPwd: md5("123123"),
        email: `example${i}@qq.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: Math.random() < 0.5,
        enable: Math.random() < 0.5,
      });
    }
    await queryInterface.bulkInsert("users", users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "users",
      {},
      {
        truncate: true,
      }
    );
  },
};
