import { Component, OnInit } from '@angular/core';
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
export class ChartLinhaGastosComponent implements OnInit {
  public lineChartType = 'line' as const;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Gastos por dia',
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
      next: (data) => this.montarDados(data),
      error: (err) => console.error('Erro ao carregar gráfico de linha:', err)
    });
  }

  private montarDados(transacoes: Transaction[]) {
    const porDia = new Map<string, number>();

    const gastos = transacoes.filter(t => t.type === 'EXPENSE');

    for (const t of gastos) {
      const [ano, mes, dia] = t.date.split('-').map(Number);
      const chaveOrdenacao = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const atual = porDia.get(chaveOrdenacao) ?? 0;
      porDia.set(chaveOrdenacao, atual + t.amount);
    }

    const ordenado = Array.from(porDia.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    const labels = ordenado.map(([data]) => {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}`;
    });

    const valores = ordenado.map(([, valor]) => valor);

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
