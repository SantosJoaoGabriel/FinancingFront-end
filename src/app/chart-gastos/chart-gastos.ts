import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionsService, Transaction } from '../core/transactions.service';

@Component({
  selector: 'app-chart-gastos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-gastos.html',
  styleUrl: './chart-gastos.css'
})
export class ChartGastosComponent implements OnInit {
  public doughnutChartType = 'doughnut' as const;

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#0d1626',
        borderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  private cores: { [key: string]: string } = {
    'Alimentação': '#10b981',
    'Transporte': '#2563eb',
    'Assinaturas': '#9333ea',
    'Lazer': '#db2777',
    'Moradia': '#d97706',
    'Saúde': '#dc2626'
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => this.montarDados(data),
      error: (err) => console.error('Erro ao carregar gráfico de rosca:', err)
    });
  }

  private montarDados(transacoes: Transaction[]) {
    const porCategoria = new Map<string, number>();

    const gastos = transacoes.filter(t => t.type === 'EXPENSE');

    for (const t of gastos) {
      const atual = porCategoria.get(t.category) ?? 0;
      porCategoria.set(t.category, atual + t.amount);
    }

    const labels = Array.from(porCategoria.keys());
    const valores = Array.from(porCategoria.values());
    const cores = labels.map(label => this.cores[label] || '#6b7280');

    this.doughnutChartData = {
      ...this.doughnutChartData,
      labels,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: valores,
          backgroundColor: cores
        }
      ]
    };
  }
}
