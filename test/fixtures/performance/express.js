import express from 'express';

const app = express();

app.disable('etag');
app.disable('x-powered-by');

app.get('/', (req, res) => res.json({ hello: 'world' }));

export const server = app;
