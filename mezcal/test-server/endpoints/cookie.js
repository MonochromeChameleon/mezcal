const method = 'GET';
const path = '/hello-cookie';
const handler = ctx => `${ctx.cookie.greeting} ${ctx.cookie.name}`;

export { method, path, handler };
