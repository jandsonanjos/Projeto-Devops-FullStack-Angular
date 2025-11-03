import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transacao {
  id: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extrato.html',
  styleUrls: ['./extrato.css']
})
export class Extrato implements OnInit {
  transacoes: Transacao[] = [];
  filtroMes: string;
  filtroPeriodo: 'todos' | '7dias' | '15dias' | '30dias' = '30dias';
  
  constructor() {
    this.filtroMes = new Date().toISOString().slice(0, 7); // Formato: YYYY-MM
    this.gerarTransacoesExemplo();
  }

  ngOnInit() {
    this.filtrarTransacoes();
  }

  gerarTransacoesExemplo() {
    // Gerando dados de exemplo para o último mês
    const hoje = new Date();
    const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
    
    this.transacoes = [
      {
        id: 1,
        tipo: 'entrada',
        descricao: 'Salário',
        valor: 5000.00,
        data: new Date(hoje.getFullYear(), hoje.getMonth(), 5),
        categoria: 'Receita'
      },
      {
        id: 2,
        tipo: 'saida',
        descricao: 'Aluguel',
        valor: 1200.00,
        data: new Date(hoje.getFullYear(), hoje.getMonth(), 10),
        categoria: 'Moradia'
      },
      {
        id: 3,
        tipo: 'saida',
        descricao: 'Supermercado',
        valor: 450.30,
        data: new Date(hoje.getFullYear(), hoje.getMonth(), 15),
        categoria: 'Alimentação'
      },
      {
        id: 4,
        tipo: 'entrada',
        descricao: 'Freelance',
        valor: 1200.00,
        data: new Date(hoje.getFullYear(), hoje.getMonth(), 20),
        categoria: 'Receita'
      },
      {
        id: 5,
        tipo: 'saida',
        descricao: 'Conta de Luz',
        valor: 150.00,
        data: new Date(hoje.getFullYear(), hoje.getMonth(), 22),
        categoria: 'Utilidades'
      }
    ];
  }

  filtrarTransacoes() {
    let dataLimite: Date;
    const hoje = new Date();

    switch (this.filtroPeriodo) {
      case '7dias':
        dataLimite = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '15dias':
        dataLimite = new Date(hoje.getTime() - 15 * 24 * 60 * 60 * 1000);
        break;
      case '30dias':
        dataLimite = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dataLimite = new Date(0); // Todas as transações
    }

    return this.transacoes
      .filter(t => t.data >= dataLimite)
      .sort((a, b) => b.data.getTime() - a.data.getTime());
  }

  getValorTotal(): { entradas: number; saidas: number; saldo: number } {
    const transacoesFiltradas = this.filtrarTransacoes();
    const entradas = transacoesFiltradas
      .filter(t => t.tipo === 'entrada')
      .reduce((total, t) => total + t.valor, 0);
    const saidas = transacoesFiltradas
      .filter(t => t.tipo === 'saida')
      .reduce((total, t) => total + t.valor, 0);
    
    return {
      entradas,
      saidas,
      saldo: entradas - saidas
    };
  }
}
