const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:4000',
    'https://catalogo-perfumes-fr-2026.onrender.com',
    /\.onrender\.com$/
  ]
}));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
});

app.get('/api/perfumes', (req, res) => {
  db.query('SELECT * FROM perfumes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Buscar por slug (texto) o por id (número)
app.get('/api/perfumes/:slugOrId', (req, res) => {
  const param = req.params.slugOrId;
  const isId = /^\d+$/.test(param);
  const query = isId
    ? 'SELECT * FROM perfumes WHERE id = ?'
    : 'SELECT * FROM perfumes WHERE slug = ?';

  db.query(query, [param], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});