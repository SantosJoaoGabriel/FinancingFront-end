import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionsService, Transacao } from '../core/transactions.service';

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

  private montarDados(transacoes: Transacao[]) {
    const porDia = new Map<string, number>();

    for (const t of transacoes) {
      const dataObj = new Date(t.data);
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const chave = `${dia}/${mes}`;

      const atual = porDia.get(chave) ?? 0;
      porDia.set(chave, atual + t.valor);
    }

    // precisa criar um novo objeto para o Angular detectar a mudança
    this.lineChartData = {
      ...this.lineChartData,
      labels: Array.from(porDia.keys()),
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: Array.from(porDia.values())
        }
      ]
    };
  }
}
