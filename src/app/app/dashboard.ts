import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Account } from './services/account';

Chart.register(...registerables);

interface TransacaoRecente {
  id: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data: Date;
}

interface DadosGrafico {
  labels: string[];
  valores: number[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('gastosPorCategoriaChart') gastosPorCategoriaChart!: ElementRef;
  @ViewChild('fluxoCaixaChart') fluxoCaixaChart!: ElementRef;

  saldoAtual: number = 0;
  receitaMensal: number = 0;
  despesaMensal: number = 0;
  transacoesRecentes: TransacaoRecente[] = [];

  private gastosChartInstance: any = null;
  private fluxoChartInstance: any = null;

  constructor(private account: Account) {
    // não gerar dados de exemplo aqui — vamos popular com dados do backend
  }

  ngOnInit(): void {
    // Buscar dados iniciais
    this.carregarDados();
  }

  ngAfterViewInit(): void {
    // criar gráficos vazios; serão preenchidos quando os dados chegarem
    this.criarGraficoGastosPorCategoria();
    this.criarGraficoFluxoCaixa();
  }

  private gerarDadosExemplo(): void {
    // Gerando transações recentes de exemplo
    this.transacoesRecentes = [
      {
        id: 1,
        tipo: 'entrada',
        descricao: 'Salário',
        valor: 5000.00,
        data: new Date()
      },
      {
        id: 2,
        tipo: 'saida',
        descricao: 'Aluguel',
        valor: 1200.00,
        data: new Date()
      },
      {
        id: 3,
        tipo: 'saida',
        descricao: 'Supermercado',
        valor: 450.30,
        data: new Date()
      },
      {
        id: 4,
        tipo: 'entrada',
        descricao: 'Freelance',
        valor: 800.00,
        data: new Date()
      }
    ];
  }

  private carregarDados(): void {
    // saldo
    this.account.getSaldo().subscribe({
      next: (res) => {
        this.saldoAtual = Number(res.saldo) || 0;
      },
      error: (err) => console.error('Erro ao obter saldo', err)
    });

    // extrato
    this.account.getExtrato().subscribe({
      next: (transacoes) => {
        // mapear para o formato usado no front
        this.transacoesRecentes = transacoes.map((t: any) => ({
          id: t.id,
          tipo: ['DEPOSITO', 'PIX'].includes(t.tipo) ? 'entrada' : 'saida',
          descricao: t.descricao || t.tipo,
          valor: parseFloat(t.valor),
          data: new Date(t.created_at || t.createdAt || t.data)
        }));

        // calcular receitas/despesas do mês atual
        this.calcularReceitaDespesaMensal();

        // atualizar gráficos com os dados reais
        this.atualizarGraficoGastos();
        this.atualizarGraficoFluxo();
      },
      error: (err) => console.error('Erro ao obter extrato', err)
    });
  }

  private calcularReceitaDespesaMensal(): void {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    let receita = 0;
    let despesa = 0;

    for (const t of this.transacoesRecentes) {
      const d = new Date(t.data);
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.tipo === 'entrada') receita += t.valor;
        else despesa += t.valor;
      }
    }

    this.receitaMensal = receita;
    this.despesaMensal = despesa;
  }

  private atualizarGraficoGastos(): void {
    if (!this.gastosChartInstance) return;

    // Por simplicidade, agrupar por tipo (Entradas vs Saídas)
    const entradas = this.transacoesRecentes.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
    const saidas = this.transacoesRecentes.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);

    this.gastosChartInstance.data = {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        data: [entradas, saidas],
        backgroundColor: ['#4CAF50', '#f44336']
      }]
    };
    this.gastosChartInstance.update();
  }

  private atualizarGraficoFluxo(): void {
    if (!this.fluxoChartInstance) return;

    // Construir séries dos últimos 6 meses
    const labels: string[] = [];
    const receitas: number[] = [];
    const despesas: number[] = [];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('pt-BR', { month: 'short' });
      labels.push(label.charAt(0).toUpperCase() + label.slice(1));

      const month = d.getMonth();
      const year = d.getFullYear();

      const monthTrans = this.transacoesRecentes.filter(t => {
        const td = new Date(t.data);
        return td.getMonth() === month && td.getFullYear() === year;
      });

      const r = monthTrans.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0);
      const s = monthTrans.filter(t => t.tipo === 'saida').reduce((suma, t) => suma + t.valor, 0);

      receitas.push(r);
      despesas.push(s);
    }

    this.fluxoChartInstance.data = {
      labels,
      datasets: [
        { label: 'Receitas', data: receitas, borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)', fill: true },
        { label: 'Despesas', data: despesas, borderColor: '#f44336', backgroundColor: 'rgba(244, 67, 54, 0.1)', fill: true }
      ]
    };
    this.fluxoChartInstance.update();
  }

  private criarGraficoGastosPorCategoria(): void {
    const ctx = this.gastosPorCategoriaChart.nativeElement.getContext('2d');
    
    const data = {
      labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Outros'],
      datasets: [{
        data: [1200, 800, 400, 300, 200, 300],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Gastos por Categoria'
          }
        }
      }
    });
  }

  private criarGraficoFluxoCaixa(): void {
    const ctx = this.fluxoCaixaChart.nativeElement.getContext('2d');
    
    const data = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Receitas',
          data: [7500, 7500, 7800, 7500, 8200, 7500],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true
        },
        {
          label: 'Despesas',
          data: [4800, 5200, 4900, 5100, 4800, 4800],
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          fill: true
        }
      ]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Fluxo de Caixa'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
