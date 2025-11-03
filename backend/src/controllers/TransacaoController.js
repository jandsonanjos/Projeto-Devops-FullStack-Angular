const Transacao = require('../models/Transacao');
const Usuario = require('../models/Usuario');

class TransacaoController {
  async getSaldo(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.userId);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      return res.json({ saldo: usuario.saldo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getExtrato(req, res) {
    try {
      const transacoes = await Transacao.findAll({
        where: { usuario_id: req.userId },
        order: [['created_at', 'DESC']]
      });

      return res.json(transacoes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async criar(req, res) {
    try {
      const { tipo, valor, descricao } = req.body;
      if (!tipo || !valor) {
        return res.status(400).json({ error: 'Tipo e valor são obrigatórios' });
      }

      const usuario = await Usuario.findByPk(req.userId);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      // Criar transação
      const transacao = await Transacao.create({
        usuario_id: req.userId,
        tipo,
        valor,
        descricao,
        status: 'CONCLUIDA'
      });

      // Atualizar saldo do usuário para operações que afetam saldo
      const numericValor = parseFloat(valor);
      if (['DEPOSITO', 'PIX'].includes(tipo)) {
        usuario.saldo = parseFloat(usuario.saldo) + numericValor;
      } else if (['SAQUE', 'TRANSFERENCIA'].includes(tipo)) {
        usuario.saldo = parseFloat(usuario.saldo) - numericValor;
      }

      await usuario.save();

      return res.status(201).json(transacao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new TransacaoController();