const method = 'GET';
const path = '/hello/:param';
const handler = ctx => `Hello ${ctx.pathParams.param}`;

export { method, path, handler };
