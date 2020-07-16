// 鉴权的中间件

module.exports = (options, app) => {
  return async function (ctx, next) {
    try {
      await next();
      ctx.body = {
        code: 0,
        detail: null,
        data: ctx.body,
      };
    } catch (err) {
      if (err instanceof ctx.helper.ValidateError) {
        ctx.body = {
          code: 422,
          detail: err.errors,
          data: null,
        };
        ctx.status = 422;
        return;
      }
      ctx.status = 500;
      ctx.detail = "internal server error";
      throw err;
    }
  };
};
