import cookie from 'cookie';
import signature from 'cookie-signature';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

import { request } from '../mezcal';

const privateKey = fs.promises.readFile('mezcal/test-server/crypto/jwt-private-key.key');

const generateJwt = async (options = {}) => {
  const key = await privateKey;
  const opts = { algorithm: 'RS256', audience: 'me', issuer: 'mezcal', ...options };
  return jsonwebtoken.sign({ foo: 'bar' }, key, opts);
};

describe('GET requests', () => {
  it('GET request', async () => {
    const response = await request.get('/hello-world');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('GET request with path parameters', async () => {
    const response = await request.get('/hello/Hugh');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('GET request with regex path parameters', async () => {
    const response = await request.get('/hello-regex/3');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hello Hello');
  });

  it('GET request with multiple path parameters', async () => {
    const response = await request.get('/hello/will/this/work/yes');

    expect(response.status).toBe(200);
    expect(response.text).toBe('will this work');
  });

  it('GET request with conflicting path parameters', async () => {
    const response = await request.get('/hello/something/quite/silly/yes');

    expect(response.status).toBe(200);
    expect(response.text).toBe('something silly');
  });

  it('GET request with non-matching regex path parameters', async () => {
    const response = await request.get('/hello-regex/three');

    expect(response.status).toBe(404);
  });

  it('GET request with catch-all path parts', async () => {
    const response = await request.get('/catch/whatever/all');
    expect(response.status).toBe(200);
    expect(response.text).toBe("Gotta catch 'em all");
  });

  it('GET request with ignored query parameters', async () => {
    const response = await request.get('/hello/Hugh?greeting=hi');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('GET request with query parameters', async () => {
    const response = await request.get('/greet/Hugh?greeting=Hi');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hi Hugh');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('GET JSON', async () => {
    const response = await request.get('/hello-object');

    expect(response.status).toBe(200);
    expect(response.text).toBe('{"hello":"world"}');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('application/json');
  });

  it('GET request 404', async () => {
    const response = await request.get('/no/such/endpoint');

    expect(response.status).toBe(404);
  });

  it('GET request 403', async () => {
    const response = await request.get('/secured');

    expect(response.status).toBe(403);
  });

  it('GET request 500', async () => {
    const response = await request.get('/throw-error');

    expect(response.status).toBe(500);
  });

  it('GET request secured endpoint with valid jwt', async () => {
    const jwt = await generateJwt();
    const response = await request.get('/secured').set({ Authorization: `Bearer ${jwt}` });

    expect(response.status).toBe(200);
    expect(response.text).toBe('This is great');
  });

  it('GET request secured endpoint jwt for wrong issuer', async () => {
    const jwt = await generateJwt({ issuer: 'tequila' });
    const response = await request.get('/secured').set({ Authorization: `Bearer ${jwt}` });

    expect(response.status).toBe(403);
  });

  it('GET request secured endpoint jwt for wrong audience', async () => {
    const jwt = await generateJwt({ audience: 'Kat' });
    const response = await request.get('/secured').set({ Authorization: `Bearer ${jwt}` });

    expect(response.status).toBe(403);
  });

  it('Default headers', async () => {
    const response = await request.get('/hello-world');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
    expect(response.headers).toHaveProperty('x-frame-options');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers).toHaveProperty('x-content-type-options');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('Cookie value', async () => {
    const name = cookie.serialize('name', 'Hugh');
    const greeting = cookie.serialize('greeting', 'Hello');
    const response = await request.get('/hello-cookie').set({ cookie: [name, greeting] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh');
  });

  it('Missing cookie value', async () => {
    const response = await request.get('/hello-cookie');

    expect(response.status).toBe(200);
    expect(response.text).toBe('undefined undefined');
  });

  it('Difficult cookie value', async () => {
    const name = cookie.serialize('name', 'Hugh; what is a semicolon for?');
    const greeting = cookie.serialize('greeting', 'Hello');
    const response = await request.get('/hello-cookie').set({ cookie: [name, greeting] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh; what is a semicolon for?');
  });

  it('Signed cookie value', async () => {
    const signed = signature.sign('Hugh', 'oooooooh');
    const name = cookie.serialize('name', `s:${signed}`);
    const response = await request.get('/hello-signed-cookie').set({ cookie: [name] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh');
  });

  it('Signed cookie value not signed', async () => {
    const name = cookie.serialize('name', 'Hugh');
    const response = await request.get('/hello-signed-cookie').set({ cookie: [name] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello undefined');
  });

  it('Signed cookie value wrong secret', async () => {
    const signed = signature.sign('Hugh', 'oooooh');
    const name = cookie.serialize('name', `s:${signed}`);
    const response = await request.get('/hello-signed-cookie').set({ cookie: [name] });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello undefined');
  });

  it('Send files', async () => {
    const favicon = await fs.promises.readFile('./assets/favicon.ico');
    const response = await request.get('/favicon.ico');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(favicon);
  });

  it('Automatic error handling', async () => {
    const responses = await Promise.all(
      ['tea', 'coffee', 'hot chocolate'].map(drink => request.get(`/make-drink/${drink}`))
    );

    expect(responses.map(r => r.status)).toStrictEqual([200, 418, 200]);
    expect(responses.map(r => r.text)).toStrictEqual([
      'How about a nice cuppa?',
      "I'm a Teapot",
      'Please try a different drink',
    ]);
  });

  it('Uses endpoints directly when specified', async () => {
    const response = await request.get('/foo');

    expect(response.status).toBe(200);
    expect(response.text).toBe('foo');
  });

  it('Uses files when specified instead of directories', async () => {
    const response = await request.get('/bar');

    expect(response.status).toBe(200);
    expect(response.text).toBe('bar');
  });
});
