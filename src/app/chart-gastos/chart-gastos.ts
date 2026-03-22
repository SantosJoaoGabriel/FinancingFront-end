import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionsService, Transacao } from '../core/transactions.service';

@Component({
  selector: 'app-chart-gastos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-gastos.html',
  styleUrl: './chart-gastos.css'
})
export class ChartGastosComponent {
  public doughnutChartType = 'doughnut' as const;

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#6b7280'],
        borderColor: '#0d1626',
        borderWidth: 3,
        hoverOffset: 4
      }
    ]
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

  constructor(private transactionsService: TransactionsService) {
  this.transactionsService.getTransacoes().subscribe({
    next: (data) => this.montarDados(data),
    error: (err) => console.error('Erro ao carregar gráfico:', err)
  });
}


  private montarDados(transacoes: Transacao[]) {
    const porCategoria = new Map<string, number>();

    for (const t of transacoes) {
      const atual = porCategoria.get(t.categoria) ?? 0;
      porCategoria.set(t.categoria, atual + t.valor);
    }

    this.doughnutChartData.labels = Array.from(porCategoria.keys());
    this.doughnutChartData.datasets[0].data = Array.from(porCategoria.values());
  }
}
