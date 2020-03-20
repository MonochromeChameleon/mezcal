import { resolve } from 'path';

const filePath = resolve('assets/favicon.ico');

const method = 'GET';
const path = '/favicon.ico';
const handler = ctx => ctx.sendFile(filePath);

export { method, path, handler };
