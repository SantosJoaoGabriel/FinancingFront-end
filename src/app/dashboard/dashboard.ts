import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ChartGastosComponent } from '../chart-gastos/chart-gastos';
import { ChartLinhaGastosComponent } from '../chart-linha-gastos/chart-linha-gastos';
import { TransactionsService, Transacao } from '../core/transactions.service';
import { MatIconModule } from '@angular/material/icon';

interface LegendaItem {
  categoria: string;
  valor: number;
  cor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    ChartGastosComponent,
    ChartLinhaGastosComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  saldoTotal = 0;
  gastosMes = 0;
  metasMes = 3000;
  metaPorcentagem = 0;
  metaRestante = 0;
  transacoesRecentes: Transacao[] = [];
  legendaGastos: LegendaItem[] = [];

  private cores: { [key: string]: string } = {
    'Alimentação': '#10b981',
    'Transporte': '#f97316',
    'Assinaturas': '#137fec',
    'Lazer': '#a855f7',
    'Moradia': '#f59e0b',
    'Saúde': '#ef4444'
  };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.gastosMes = data.reduce((total, t) => total + t.valor, 0);
        this.saldoTotal = this.metasMes - this.gastosMes;
        this.metaPorcentagem = Math.min(
          Math.round((this.gastosMes / this.metasMes) * 100), 100
        );
        this.metaRestante = Math.max(this.metasMes - this.gastosMes, 0);

        this.transacoesRecentes = [...data]
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, 5);

        // montar legenda do donut
        const porCategoria = new Map<string, number>();
        for (const t of data) {
          const atual = porCategoria.get(t.categoria) ?? 0;
          porCategoria.set(t.categoria, atual + t.valor);
        }
        this.legendaGastos = Array.from(porCategoria.entries()).map(([cat, val]) => ({
          categoria: cat,
          valor: val,
          cor: this.cores[cat] || '#6b7280'
        }));
      },
      error: (err) => console.error('Erro ao carregar dashboard:', err)
    });
  }

  getCategoryIcon(cat: string): string {
    const icons: { [key: string]: string } = {
      'Alimentação': 'restaurant',
      'Transporte': 'local_taxi',
      'Assinaturas': 'subscriptions',
      'Lazer': 'movie',
      'Moradia': 'home',
      'Saúde': 'favorite'
    };
    return icons[cat] || 'shopping_bag';
  }

  getCategoryColor(cat: string): string {
    return this.cores[cat] || '#6b7280';
  }

  getCategoryBadgeClass(cat: string): string {
    const classes: { [key: string]: string } = {
      'Alimentação': 'badge-food',
      'Transporte': 'badge-transport',
      'Assinaturas': 'badge-default',
      'Lazer': 'badge-default',
      'Moradia': 'badge-default',
      'Saúde': 'badge-default'
    };
    return classes[cat] || 'badge-default';
  }
}
