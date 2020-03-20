import childProcess from 'child_process';

const [lastArg] = process.argv.reverse();

const lookupServer = server => {
  switch (server) {
    case 'fastify':
      return './fixtures/performance/fastify.js';
    case 'express':
      return './fixtures/performance/express.js';
    case 'raw':
      return './fixtures/performance/raw.js';
    default:
      return './fixtures/performance/mezcal.js';
  }
};

const fixture = lookupServer(lastArg);

const port = 4999;
import(fixture)
  .then(({ server }) => server.listen(port))
  .then(
    server =>
      new Promise(resolve => {
        const cp = childProcess.spawn('npx', ['autocannon', '-c', 100, '-d', 1, '-p', 10, `localhost:${port}`], {
          stdio: 'ignore',
        });
        cp.on('exit', () => resolve(server));
      })
  )
  .then(
    server =>
      new Promise(resolve => {
        const cp = childProcess.spawn('npx', ['autocannon', '-c', 100, '-d', 30, '-p', 10, `localhost:${port}`], {
          stdio: 'inherit',
        });
        cp.on('exit', () => resolve(server));
      })
  )
  .then(server => server.close());
