import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { TransactionsService, Transacao } from '../core/transactions.service';

@Component({
  selector: 'app-chart-linha-gastos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-linha-gastos.html',
  styleUrl: './chart-linha-gastos.css'
})
export class ChartLinhaGastosComponent {
  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Gastos por dia',
        data: [],
        fill: true,
        tension: 0.4,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4caf50'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#333333' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#333333' }
      }
    }
  };

  constructor(private transactionsService: TransactionsService) {
    const transacoes = this.transactionsService.getTransacoes();
    this.montarDados(transacoes);
  }

  private montarDados(transacoes: Transacao[]) {
    // soma de gastos por dia (chave: 'dd/MM')
    const porDia = new Map<string, number>();

    for (const t of transacoes) {
      const dataObj = new Date(t.data);
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const chave = `${dia}/${mes}`;

      const atual = porDia.get(chave) ?? 0;
      porDia.set(chave, atual + t.valor);
    }

    const labels = Array.from(porDia.keys());
    const valores = Array.from(porDia.values());

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = valores;
  }
}
