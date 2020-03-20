import { request } from '../mezcal';

describe('POST requests', () => {
  it('POST request', async () => {
    const response = await request.post('/hello-world');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('POST request with JSON body', async () => {
    const response = await request.post('/hello').send({ person: 'Hugh' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Hugh');
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toBe('text/plain');
  });

  it('POST request 404', async () => {
    const response = await request.post('/no/such/endpoint');

    expect(response.status).toBe(404);
  });
});
