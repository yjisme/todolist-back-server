function userApi(router) {
  router.get("/api/user", "user.getUsers");
  router.post("/api/user", "user.addUser");
  router.post("/api/user/login", "user.login");
  router.put("/api/user/:id", "user.update");
  router.get("/api/user/one", "user.getUser");
}

function categoryApi(router) {
  router.post("/api/cate", "category.addCategory");
  router.put("/api/cate/:id", "category.updateCategory");
  router.delete("/api/cate/:id", "category.deleteCategory");
  router.get("/api/:userId/cate", "category.getAllCategory");
}

function settingApi(router) {
  router.get("/api/setting", "setting.getSetting");
  router.put("/api/setting", "setting.setSetting");
}

module.exports = (app) => {
  const { router } = app;
  userApi(router);
  categoryApi(router);
  settingApi(router);
};
