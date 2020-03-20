const method = 'GET';
const path = '/hello-signed-cookie';
const handler = ctx => `Hello ${ctx.signedCookie.name}`;

export { method, path, handler };
