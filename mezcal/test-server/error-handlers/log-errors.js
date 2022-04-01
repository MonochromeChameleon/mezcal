const isError = e => e;
const handler = (e, ctx) => ctx.log.error(e);

export { isError, handler };
