module.exports = (options, app) => {
  return async function (ctx, next) {
    let page = parseInt(ctx.query.page);
    let limit = parseInt(ctx.query.limit);
    if (isNaN(page)) {
      page = undefined;
    }
    if (isNaN(limit)) {
      limit = undefined;
    }
    ctx.query.page = page;
    ctx.query.limit = limit;
    await next();
  };
};
