import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ChartGastosComponent } from '../chart-gastos/chart-gastos';
import { ChartLinhaGastosComponent } from '../chart-linha-gastos/chart-linha-gastos';
import { TransactionsService, Transaction } from '../core/transactions.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    ChartGastosComponent,
    ChartLinhaGastosComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  ganhosMes = 0;
  gastosMes = 0;
  saldoTotal = 0;

  metasMes = 0;
  metaPorcentagem = 0;
  metaRestante = 0;
  periodoSelecionado = 6;

  transacoesRecentes: Transaction[] = [];
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

  ngOnInit(): void {
    this.carregarDados();
  }

    carregarDados(): void {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        const transacoesMesAtual = data.filter(t => this.isMesAtual(t.date));

        this.ganhosMes = transacoesMesAtual
          .filter(t => t.type === 'INCOME')
          .reduce((total, t) => total + (t.amount ?? 0), 0);

        this.gastosMes = transacoesMesAtual
          .filter(t => t.type === 'EXPENSE')
          .reduce((total, t) => total + (t.amount ?? 0), 0);

        this.saldoTotal = this.ganhosMes - this.gastosMes;

        this.metasMes = this.ganhosMes;

        this.metaPorcentagem = this.metasMes > 0
          ? Math.min(Math.round((this.gastosMes / this.metasMes) * 100), 100)
          : 0;

        this.metaRestante = Math.max(this.metasMes - this.gastosMes, 0);

        this.transacoesRecentes = [...data]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        const porCategoria = new Map<string, number>();

        for (const t of transacoesMesAtual.filter(t => t.type === 'EXPENSE')) {
          const atual = porCategoria.get(t.category) ?? 0;
          porCategoria.set(t.category, atual + (t.amount ?? 0));
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

  private isMesAtual(dataString: string): boolean {
    const hoje = new Date();

    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    return (
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
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
