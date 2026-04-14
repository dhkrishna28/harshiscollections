const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createStorage(subfolder) {
  // Store uploads inside the frontend public folder so the dev server can serve them
  // Note: this mixes runtime uploads with frontend assets (not recommended for prod).
  const dest = path.join(__dirname, '../../../frontend/public/uploads', subfolder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  });
}

function fileFilter(_req, file, cb) {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files are allowed.'));
}

const uploadProduct = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

const uploadCms = multer({
  storage: createStorage('cms'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = { uploadProduct, uploadCms };
