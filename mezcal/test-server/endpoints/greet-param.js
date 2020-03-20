const method = 'GET';
const path = '/greet/:param';
const handler = ctx => `${ctx.queryParams.greeting} ${ctx.pathParams.param}`;

export { method, path, handler };
