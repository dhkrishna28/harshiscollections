const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"${process.env.MAIL_FROM_NAME || 'Harshis Collections'}" <${process.env.SMTP_USER}>`;
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function sendVerificationEmail(to, token) {
  const link = `${BASE_URL}/auth/verify-email/${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your email address',
    html: `
      <h2>Welcome!</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${link}" style="padding:10px 20px;background:#4f46e5;color:#fff;border-radius:4px;text-decoration:none;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

async function sendPasswordResetEmail(to, token) {
  const link = `${BASE_URL}/auth/reset-password/${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${link}" style="padding:10px 20px;background:#4f46e5;color:#fff;border-radius:4px;text-decoration:none;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
}

async function sendOrderConfirmationEmail(to, order) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Order Confirmed – ${order.order_number}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order Number: <strong>${order.order_number}</strong></p>
      <p>Total: <strong>₹${order.total}</strong></p>
      <p>We will notify you when your order ships.</p>
    `,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmationEmail };
