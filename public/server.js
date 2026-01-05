const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Porta dinâmica para Render

app.use(cors());
app.use(express.json());

// Pasta de uploads acessível publicamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const FILE = './produtos.json';

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// GET: retorna todos os produtos
app.get('/produtos', (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  res.json(data);
});

// POST: adiciona um novo produto
app.post('/produtos', upload.single('image'), (req, res) => {
  const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
  const { name, price, available } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  data.push({ name, price, available: available === 'true', image });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// DELETE: remove produto por índice
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

// PATCH: alterna status de disponibilidade
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

// Inicia o servidor
const path = require('path');

// Servir arquivos estáticos (cliente e admin)
app.use(express.static(path.join(__dirname, 'public')));

// Se a rota não for API, manda o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
