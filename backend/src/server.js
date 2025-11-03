require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const routes = require('./routes');

const app = express();

// Middlewares
// Configurar CORS para permitir chamadas do frontend (ajuste FRONTEND_URL em .env se necessário)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // não usamos cookies de sessão; apenas Authorization header
};
app.use(cors(corsOptions));
// Permitir preflight para todas as rotas
app.options('*', cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/api', routes);

// Sincronizar banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});