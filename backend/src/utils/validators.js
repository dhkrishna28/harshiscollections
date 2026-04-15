const { body, validationResult } = require('express-validator');

/**
 * Returns middleware that sends 422 if express-validator found errors.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
}

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const registerRules = [
  body('first_name').trim().notEmpty().withMessage('First name is required.'),
  body('last_name').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

const changePasswordRules = [
  body('current_password').notEmpty().withMessage('Current password is required.'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
];

const emailRules = [
  body('email').isEmail().withMessage('Valid email is required.'),
];

const resetPasswordRules = [
  body('token').trim().notEmpty().withMessage('Reset token is required.'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
];

const orderRules = [
  body('payment_method').isIn(['cod', 'online']).withMessage('Payment method must be cod or online.'),
  body('shipping_name').trim().isLength({ min: 2, max: 160 }).withMessage('Shipping name is required.'),
  body('shipping_phone').optional({ values: 'falsy' }).isLength({ min: 8, max: 20 }).withMessage('Phone number looks invalid.'),
  body('shipping_address').trim().isLength({ min: 5, max: 255 }).withMessage('Shipping address is required.'),
  body('shipping_city').trim().isLength({ min: 2, max: 100 }).withMessage('City is required.'),
  body('shipping_state').trim().isLength({ min: 2, max: 100 }).withMessage('State is required.'),
  body('shipping_postal').trim().isLength({ min: 4, max: 20 }).withMessage('Postal code is required.'),
  body('shipping_country').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 80 }).withMessage('Country looks invalid.'),
  body('notes').optional({ values: 'falsy' }).isLength({ max: 2000 }).withMessage('Notes are too long.'),
];

const profileRules = [
  body('first_name').optional().trim().isLength({ min: 1, max: 80 }).withMessage('First name looks invalid.'),
  body('last_name').optional().trim().isLength({ min: 1, max: 80 }).withMessage('Last name looks invalid.'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ min: 8, max: 20 }).withMessage('Phone number looks invalid.'),
  body('address_line1').optional({ values: 'falsy' }).trim().isLength({ max: 255 }).withMessage('Address line 1 is too long.'),
  body('address_line2').optional({ values: 'falsy' }).trim().isLength({ max: 255 }).withMessage('Address line 2 is too long.'),
  body('city').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('City is too long.'),
  body('state').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('State is too long.'),
  body('postal_code').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Postal code is too long.'),
  body('country').optional({ values: 'falsy' }).trim().isLength({ max: 80 }).withMessage('Country is too long.'),
];

const categoryCreateRules = [
  body('name').trim().notEmpty().withMessage('Category name is required.').isLength({ max: 120 }).withMessage('Category name is too long.'),
  body('description').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Description is too long.'),
  body('parent_id').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Parent category must be a valid category id.'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.'),
  body('is_active').optional({ values: 'falsy' }).isBoolean().withMessage('is_active must be true or false.'),
];

const categoryUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty.').isLength({ max: 120 }).withMessage('Category name is too long.'),
  body('description').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Description is too long.'),
  body('parent_id').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Parent category must be a valid category id.'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.'),
  body('is_active').optional({ values: 'falsy' }).isBoolean().withMessage('is_active must be true or false.'),
];

const productCreateRules = [
  body('name').trim().notEmpty().withMessage('Product name is required.').isLength({ max: 200 }).withMessage('Product name is too long.'),
  body('slug').optional({ values: 'falsy' }).trim().isLength({ max: 220 }).withMessage('Slug is too long.'),
  body('category_id').isInt({ min: 1 }).withMessage('Category is required.'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  body('compare_at_price').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Compare-at price must be a non-negative number.'),
  body('stock_quantity').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
  body('availability_status').optional({ values: 'falsy' }).isIn(['in_stock', 'out_of_stock']).withMessage('Availability status is invalid.'),
  body('status').optional({ values: 'falsy' }).isIn(['draft', 'published']).withMessage('Status is invalid.'),
  body('is_featured').optional({ values: 'falsy' }).isBoolean().withMessage('is_featured must be true or false.'),
];

const productUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty.').isLength({ max: 200 }).withMessage('Product name is too long.'),
  body('slug').optional({ values: 'falsy' }).trim().isLength({ max: 220 }).withMessage('Slug is too long.'),
  body('category_id').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Category must be a valid category id.'),
  body('price').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  body('compare_at_price').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Compare-at price must be a non-negative number.'),
  body('stock_quantity').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
  body('availability_status').optional({ values: 'falsy' }).isIn(['in_stock', 'out_of_stock']).withMessage('Availability status is invalid.'),
  body('status').optional({ values: 'falsy' }).isIn(['draft', 'published']).withMessage('Status is invalid.'),
  body('is_featured').optional({ values: 'falsy' }).isBoolean().withMessage('is_featured must be true or false.'),
];

const adminOrderStatusRules = [
  body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Order status is invalid.'),
  body('payment_status').optional().isIn(['unpaid', 'paid', 'failed', 'refunded']).withMessage('Payment status is invalid.'),
];

const cmsPageRules = [
  body('title').trim().notEmpty().withMessage('Page title is required.').isLength({ max: 200 }).withMessage('Page title is too long.'),
  body('content').optional({ values: 'falsy' }).isLength({ max: 100000 }).withMessage('Page content is too long.'),
  body('meta_title').optional({ values: 'falsy' }).isLength({ max: 200 }).withMessage('Meta title is too long.'),
  body('meta_description').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Meta description is too long.'),
  body('is_active').optional({ values: 'falsy' }).isBoolean().withMessage('is_active must be true or false.'),
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 120 }).withMessage('Name is too long.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ min: 8, max: 20 }).withMessage('Phone number looks invalid.'),
  body('subject').optional({ values: 'falsy' }).isLength({ max: 200 }).withMessage('Subject is too long.'),
  body('message').trim().notEmpty().withMessage('Message is required.').isLength({ max: 5000 }).withMessage('Message is too long.'),
];

const contactUpdateRules = [
  body('status').optional().isIn(['new', 'read', 'replied', 'closed']).withMessage('Contact status is invalid.'),
  body('admin_notes').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Admin notes are too long.'),
];

module.exports = {
  validate,
  loginRules,
  registerRules,
  changePasswordRules,
  emailRules,
  resetPasswordRules,
  orderRules,
  profileRules,
  categoryCreateRules,
  categoryUpdateRules,
  productCreateRules,
  productUpdateRules,
  adminOrderStatusRules,
  cmsPageRules,
  contactRules,
  contactUpdateRules,
};
