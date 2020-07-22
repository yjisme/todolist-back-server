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

function taskApi(router) {
  router.get("/api/:userId/task/today", "task.today");
  router.get("/api/:userId/task/schedule", "task.schedule");
  router.get("/api/:userId/task/pass", "task.pass");
  router.get("/api/:userId/task/urgency", "task.urgency");
  router.get("/api/:userId/task/notebook", "task.noteBook");
  router.get("/api/:userId/task/summary", "task.summary");
  router.get("/api/:userId/task/cate/:cateId", "task.categroyTasks");

  router.post("/api/:userId/task", "task.addTask");
  router.put("/api/:userId/task/:taskId", "task.updateTask");
  router.delete("/api/:userId/task/:taskId", "task.deleteTask");
}

function trashApi(router) {
  router.get("/api/:userId/trash", "trash.getTrashes");
  router.post("/api/:userId/trash/restore", "trash.restoreTrashes");
  router.post("/api/:userId/trash/delete", "trash.deleteTrashes");
}

module.exports = (app) => {
  const { router } = app;
  userApi(router);
  categoryApi(router);
  settingApi(router);
  taskApi(router);
  trashApi(router);
};
