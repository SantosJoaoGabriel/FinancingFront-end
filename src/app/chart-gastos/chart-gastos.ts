import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { TransactionsService, Transacao } from '../core/transactions.service';

@Component({
  selector: 'app-chart-gastos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-gastos.html',
  styleUrl: './chart-gastos.css'
})
export class ChartGastosComponent {
  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'],
        borderColor: '#121212',
        borderWidth: 2
      }
    ]
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'white' }
      }
    }
  };

  constructor(private transactionsService: TransactionsService) {
    const transacoes = this.transactionsService.getTransacoes();
    this.montarDados(transacoes);
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
