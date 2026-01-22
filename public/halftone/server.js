const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5502;

// Serve static frontend from current folder (halftone-demo)
app.use(express.static(path.join(__dirname)));

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Upload endpoint (optional; not required by current frontend)
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file received' });
  }
  const filename = path.basename(req.file.path);
  res.json({ ok: true, path: `/uploads/${filename}` });
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});