require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// 🔌 MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err))

// 📦 Schema Produto
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
})

const Product = mongoose.model('Product', ProductSchema)

// ➕ Criar produto (ADMIN)
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 📥 Listar produtos (SITE)
app.get('/api/products', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// 🌐 Rotas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'))
})

// 🚀 Start
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Servidor rodando na porta', PORT))
