const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // for handling file uploads
const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware to parse JSON in requests
app.use(express.json());

// ===== Multer setup for image uploads =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../frontend/images')); // save files in frontend/images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // unique filenames
  }
});

const upload = multer({ storage });

// ===== Test route =====
app.get('/', (req, res) => {
  res.send('Node.js backend is running!');
});

// ===== Gallery endpoints =====

// GET all gallery images
app.get('/api/gallery', (req, res) => {
  const data = fs.readFileSync('gallery.json', 'utf8');
  res.json(JSON.parse(data));
});

// POST metadata only (optional, can keep for testing)
app.post('/api/gallery', (req, res) => {
  const newImage = req.body; // {id, filename, caption, price}
  const data = JSON.parse(fs.readFileSync('gallery.json', 'utf8'));
  data.push(newImage);
  fs.writeFileSync('gallery.json', JSON.stringify(data, null, 2));
  res.status(201).send('Image added!');
});

// DELETE an image
app.delete('/api/gallery/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync('gallery.json', 'utf8'));
  data = data.filter(img => img.id !== id);
  fs.writeFileSync('gallery.json', JSON.stringify(data, null, 2));
  res.send('Image deleted!');
});

// ===== New endpoint: upload image + metadata =====
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  // Save metadata to gallery.json
  const data = JSON.parse(fs.readFileSync('gallery.json', 'utf8'));
  const newImage = {
    id: Date.now(),
    filename: req.file.filename,
    caption: req.body.caption,
    price: parseFloat(req.body.price)
  };
  data.push(newImage);
  fs.writeFileSync('gallery.json', JSON.stringify(data, null, 2));

  res.status(201).send('File uploaded and data saved!');
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});