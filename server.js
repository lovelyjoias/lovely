const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const FILE = './produtos.json';

// Upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// GET todos produtos
app.get('/produtos', (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  res.json(data);
});

// POST adicionar produto
app.post('/produtos', upload.single('image'), (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  const { name, price, available } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  data.push({ name, price, available: available === 'true', image });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// DELETE produto por índice
app.delete('/produtos/:index', (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  const idx = parseInt(req.params.index);
  if (!isNaN(idx) && data[idx]) {
    data.splice(idx, 1);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Produto não encontrado' });
  }
});

// PATCH alterar status
app.patch('/produtos/:index', (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  const idx = parseInt(req.params.index);
  if (!isNaN(idx) && data[idx]) {
    data[idx].available = !data[idx].available;
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Produto não encontrado' });
  }
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
