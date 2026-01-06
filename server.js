const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== PASTA DE UPLOADS =====
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// ===== ARQUIVO DE DADOS =====
const FILE = path.join(__dirname, 'produtos.json');
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

// ===== CONFIG MULTER =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ===== ROTAS DA API =====

// GET produtos
app.get('/produtos', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

// POST produto
app.post('/produtos', upload.single('image'), (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  const { name, price, available } = req.body;

  const novoProduto = {
    name,
    price,
    available: available === 'true',
    image: req.file ? `/uploads/${req.file.filename}` : ''
  };

  data.push(novoProduto);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json({ status: 'ok' });
});

// DELETE produto
app.delete('/produtos/:index', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  const idx = parseInt(req.params.index);

  if (!data[idx]) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  data.splice(idx, 1);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// PATCH status
app.patch('/produtos/:index', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  const idx = parseInt(req.params.index);

  if (!data[idx]) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  data[idx].available = !data[idx].available;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// ===== SITE (FRONTEND) =====
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Endpoint ping
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
