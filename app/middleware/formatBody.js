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
        msg: "",
        data: ctx.body,
      };
    } catch (err) {
      if (err instanceof ctx.helper.ValidateError) {
        let msg = err.errors;
        if (Array.isArray(msg)) {
          msg = msg.length > 0 ? msg[0].message : "validate error";
        }
        ctx.body = {
          code: err.code,
          msg,
          data: null,
        };
        ctx.status = err.code;
        return;
      }
      ctx.status = 500;
      ctx.body = {
        code: 500,
        msg: "internal server error",
        data: null,
      };
      app.logger.error(err);
    }
  };
};
