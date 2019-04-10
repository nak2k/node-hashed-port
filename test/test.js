const test = require('tape');
const { getPort } = require('..');
const debug = require('debug')('hashed-port');

test('test', t => {
  t.plan(2);

  getPort((err, port) => {
    t.error(err);

    t.equal(typeof port, 'number');
  });
});

test('test', t => {
  t.plan(2);

  delete process.env.npm_package_name;

  getPort('hashed-port', (err, port) => {
    t.error(err);

    t.equal(typeof port, 'number');
  });
});

test('test', t => {
  t.plan(1);

  delete process.env.npm_package_name;

  getPort((err, port) => {
    debug(err);
    t.ok(err instanceof Error);
  });
});
