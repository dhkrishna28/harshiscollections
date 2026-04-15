const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const adminRoutes = require('../routes/admin');
const userRoutes = require('../routes/user');
const { errorHandler, notFound } = require('../middleware/errorHandler');

const app = express();
const uploadsDir = path.join(__dirname, '../../uploads');

app.set('trust proxy', 1);

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

// CORS – tighten origins via env in production
// Include admin dev server (3002) by default in allowed origins for local dev
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:3000,http://localhost:3001,http://localhost:3002,https://harshiscollections.com'
).split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files (uploaded content) ─────────────────────────────────────────
// Runtime uploads live under the backend so they are decoupled from frontend build assets.
app.use('/uploads', express.static(uploadsDir));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Friendly root page to avoid showing raw JSON to browsers that hit the API root by mistake
app.get('/', (req, res) => {
  // Opt-in redirect: set BACKEND_ROOT_REDIRECT=true in your backend env to redirect
  // API root to the Admin dev server (useful when devs accidentally open the API URL).
  if ((process.env.BACKEND_ROOT_REDIRECT || '').toLowerCase() === 'true') {
    // Preserve query string if present
    const adminUrl = 'http://localhost:3002' + (req.url === '/' ? '' : req.url);
    return res.redirect(adminUrl);
  }

  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Harshis Collections API</title>
        <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:40px;color:#111;background:#fff}a{color:#2563eb}</style>
      </head>
      <body>
        <h1>Harshis Collections API</h1>
        <p>This server only exposes API endpoints under <code>/api/*</code>.</p>
        <ul>
          <li>Admin UI (Vite): <a href="http://harshiscollections.com">http://harshiscollections.com</a></li>
          <li>Frontend (Vite): <a href="http://harshiscollections.com">http://harshiscollections.com</a></li>
          <li>Admin API root: <code>/api/admin/</code></li>
          <li>User API root: <code>/api/user/</code></li>
        </ul>
        <p>If you expected HTML here, open the Admin or Frontend dev server instead of the API.</p>
      </body>
    </html>
  `);
});

// ─── Error Handling ───────────────────────────────────────────────────────────
// Respond to Chrome DevTools well-known probe to avoid noisy 404 logs
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  // Chrome DevTools probes this path for certain features; respond 204 to indicate
  // there's nothing to serve and avoid triggering the global notFound handler.
  res.status(204).send();
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
