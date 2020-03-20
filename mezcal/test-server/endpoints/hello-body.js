const method = 'POST';
const path = '/hello';
const handler = ctx => `Hello ${ctx.body.person}`;

export { method, path, handler };
