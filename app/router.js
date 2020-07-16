function userApi(router) {
  router.get("/api/user", "user.getUsers");
}

module.exports = (app) => {
  const { router } = app;
  userApi(router);
};
