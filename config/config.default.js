exports.keys = "to-do-list-bz-server-owc4yc";

exports.sequelize = {
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  database: "to-do-list",
  username: "root",
  password: "ybybdwyJ42.",
};

exports.middleware = ["formatBody"];

exports.formatBody = {
  match: "/api",
};
