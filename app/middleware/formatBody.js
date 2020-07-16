// 鉴权的中间件

module.exports = (options, app) => {
  return async function (ctx, next) {
    try {
      await next();
      if (ctx.status === 404) {
        return;
      }
      ctx.status = 200;
      ctx.body = {
        code: 0,
        detail: null,
        data: ctx.body,
      };
      console.log(ctx.body);
    } catch (err) {
      if (err instanceof ctx.helper.ValidateError) {
        ctx.body = {
          code: err.code,
          detail: err.errors,
          data: null,
        };
        ctx.status = err.code;
        return;
      }
      ctx.status = 500;
      ctx.body = {
        code: 500,
        detail: "internal server error",
        data: null,
      };
      throw err;
    }
  };
};
