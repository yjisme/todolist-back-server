exports.security = {
  enable: false, // 由于该服务器不直接对外，关闭对外的安全设置
};

exports.sequelize = {
  enable: true,
  package: "egg-sequelize",
};
