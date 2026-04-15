const path = require('path');
const fs = require('fs');

/**
 * Deletes a file from disk given its public URL path (e.g. /uploads/products/abc.jpg).
 * Silently fails if the file does not exist.
 */
function deleteUploadedFile(publicPath) {
  try {
    const normalizedPath = publicPath.replace(/^\/uploads\/?/, '');
    const filePath = path.join(__dirname, '../../uploads', normalizedPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Failed to delete file:', err.message);
  }
}

module.exports = { deleteUploadedFile };
