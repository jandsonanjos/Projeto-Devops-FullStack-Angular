const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const UsuarioController = require('../controllers/UsuarioController');
const TransacaoController = require('../controllers/TransacaoController');

// Rotas públicas
router.post('/login', UsuarioController.login);
router.post('/register', UsuarioController.register);

// Middleware de autenticação
router.use(authMiddleware);

// Rotas protegidas
router.get('/usuario', UsuarioController.perfil);
router.put('/usuario', UsuarioController.atualizar);
router.get('/saldo', TransacaoController.getSaldo);
router.get('/extrato', TransacaoController.getExtrato);
router.post('/transacao', TransacaoController.criar);

module.exports = router;