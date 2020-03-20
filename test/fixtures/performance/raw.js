import http from 'http';

function handle(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"hello":"world"}');
  res.end();
}

export const server = http.createServer(handle);
