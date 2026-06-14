import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionsService, Transaction } from '../core/transactions.service';

@Component({
  selector: 'app-chart-linha-gastos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-linha-gastos.html',
  styleUrl: './chart-linha-gastos.css'
})
export class ChartLinhaGastosComponent implements OnInit, OnChanges {
  @Input() periodo = 6;

  private transacoes: Transaction[] = [];

  public lineChartType = 'line' as const;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Gastos por mês',
        data: [],
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#8892a4' },
        grid: { color: '#1a2d4a' }
      },
      y: {
        ticks: { color: '#8892a4' },
        grid: { color: '#1a2d4a' }
      }
    }
  };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.transacoes = data;
        this.montarDados();
      },
      error: (err) => console.error('Erro ao carregar gráfico de linha:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodo'] && this.transacoes.length) {
      this.montarDados();
    }
  }

  private montarDados() {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - (this.periodo - 1), 1);

    const porMes = new Map<string, number>();

    for (let i = 0; i < this.periodo; i++) {
      const data = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      porMes.set(chave, 0);
    }

    const gastosFiltrados = this.transacoes.filter(t => {
      if (t.type !== 'EXPENSE') return false;

      const [ano, mes, dia] = t.date.split('-').map(Number);
      const data = new Date(ano, mes - 1, dia);

      return data >= inicio && data <= hoje;
    });

    for (const t of gastosFiltrados) {
      const [ano, mes] = t.date.split('-');
      const chave = `${ano}-${mes}`;
      const atual = porMes.get(chave) ?? 0;
      porMes.set(chave, atual + t.amount);
    }

    const labels = Array.from(porMes.keys()).map(chave => {
      const [ano, mes] = chave.split('-');
      return `${mes}/${ano.slice(2)}`;
    });

    const valores = Array.from(porMes.values());

    this.lineChartData = {
      ...this.lineChartData,
      labels,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: valores
        }
      ]
    };
  }
}
