const ORDER_STATUS_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

const PAYMENT_STATUS_TRANSITIONS = {
  unpaid: ['paid', 'failed', 'refunded'],
  paid: ['refunded'],
  failed: ['paid'],
  refunded: [],
};

function canTransition(currentStatus, nextStatus, transitions) {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true;
  return (transitions[currentStatus] || []).includes(nextStatus);
}

function canTransitionOrderStatus(currentStatus, nextStatus) {
  return canTransition(currentStatus, nextStatus, ORDER_STATUS_TRANSITIONS);
}

function canTransitionPaymentStatus(currentStatus, nextStatus) {
  return canTransition(currentStatus, nextStatus, PAYMENT_STATUS_TRANSITIONS);
}

module.exports = {
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS_TRANSITIONS,
  canTransitionOrderStatus,
  canTransitionPaymentStatus,
};
