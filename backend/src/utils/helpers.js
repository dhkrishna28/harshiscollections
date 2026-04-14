/**
 * Paginates a Sequelize result into a standard response shape.
 */
function paginate(count, rows, page, limit) {
  return {
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    data: rows,
  };
}

/**
 * Returns a success JSON envelope.
 */
function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Returns an error JSON envelope.
 */
function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

module.exports = { paginate, ok, fail };
