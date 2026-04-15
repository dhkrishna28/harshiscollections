const test = require('node:test');
const assert = require('node:assert/strict');

const {
  canTransitionOrderStatus,
  canTransitionPaymentStatus,
} = require('../src/utils/orderStatus');

test('allows valid order status transitions', () => {
  assert.equal(canTransitionOrderStatus('pending', 'processing'), true);
  assert.equal(canTransitionOrderStatus('processing', 'shipped'), true);
  assert.equal(canTransitionOrderStatus('shipped', 'delivered'), true);
  assert.equal(canTransitionOrderStatus('delivered', 'refunded'), true);
});

test('blocks invalid order status transitions', () => {
  assert.equal(canTransitionOrderStatus('pending', 'delivered'), false);
  assert.equal(canTransitionOrderStatus('cancelled', 'processing'), false);
  assert.equal(canTransitionOrderStatus('refunded', 'pending'), false);
});

test('allows valid payment status transitions', () => {
  assert.equal(canTransitionPaymentStatus('unpaid', 'paid'), true);
  assert.equal(canTransitionPaymentStatus('paid', 'refunded'), true);
  assert.equal(canTransitionPaymentStatus('failed', 'paid'), true);
});

test('blocks invalid payment status transitions', () => {
  assert.equal(canTransitionPaymentStatus('paid', 'failed'), false);
  assert.equal(canTransitionPaymentStatus('refunded', 'paid'), false);
});
