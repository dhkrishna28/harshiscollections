const test = require('node:test');
const assert = require('node:assert/strict');

const { paginate } = require('../src/utils/helpers');

test('paginate returns the standard response shape', () => {
  const rows = [{ id: 1 }, { id: 2 }];
  assert.deepEqual(paginate(12, rows, '2', 5), {
    total: 12,
    page: 2,
    pages: 3,
    data: rows,
  });
});
