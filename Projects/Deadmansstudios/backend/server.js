console.log('SERVER BOOTED: ', new Date());
const db = require('./database'); // points to database.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); // for deleting files

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'frontend')));

// Example test route
app.get('/', (req, res) => {
  res.send('Backend is running correctly!');
});

// Get all images for the gallery
app.get('/api/images', (req, res) => {
  const sql = 'SELECT * FROM images';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch images' });
    } else {
      res.json(rows);
    }
  });
});

const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // save to uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique file name
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/api/images', upload.single('image'), (req, res) => {
  console.log('Upload route hit!');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  const { caption, price } = req.body;
  const filename = req.file.filename;

  const sql = 'INSERT INTO images (filename, caption, price) VALUES (?, ?, ?)';
  db.run(sql, [filename, caption, price], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      filename,
      caption,
      price
    });
  });
});

// DELETE endpoint for admin
app.delete('/api/images/:id', (req, res) => {
  const id = req.params.id;

  // First get the filename to remove the file from uploads folder
  const selectSql = 'SELECT filename FROM images WHERE id = ?';
  db.get(selectSql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Image not found' });

    const filePath = path.join(__dirname, 'uploads', row.filename);
    fs.unlink(filePath, (fsErr) => {
      if (fsErr) console.error('Failed to delete file:', fsErr);

      // Now remove from database
      const deleteSql = 'DELETE FROM images WHERE id = ?';
      db.run(deleteSql, [id], function(dbErr) {
        if (dbErr) return res.status(500).json({ error: dbErr.message });
        res.json({ message: 'Image deleted successfully' });
      });
    });
  });
});

app.post('/api/admin-login', (req, res) => {
  const { key } = req.body;
  if (key === process.env.ADMIN_KEY) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin key' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));