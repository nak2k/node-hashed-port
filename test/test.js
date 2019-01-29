const test = require('tape');
const { getPort } = require('..');

test('test', t => {
  t.plan(2);

  getPort((err, port) => {
    t.error(err);

    t.equal(typeof port, 'number');
  });
});
