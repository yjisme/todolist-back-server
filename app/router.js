function userApi(router) {
  router.get("/api/user", "user.getUsers");
  router.post("/api/user", "user.addUser");
  router.post("/api/user/login", "user.login");
  router.put("/api/user/:id", "user.update");
  router.get("/api/user/one", "user.getUser");
}

module.exports = (app) => {
  const { router } = app;
  userApi(router);
};
