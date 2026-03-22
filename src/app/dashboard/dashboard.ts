import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChartGastosComponent } from '../chart-gastos/chart-gastos';
import { ChartLinhaGastosComponent } from '../chart-linha-gastos/chart-linha-gastos';
import { TransactionsService, Transacao } from '../core/transactions.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
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
  transacoesRecentes: Transacao[] = [];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.gastosMes = data.reduce((total, t) => total + t.valor, 0);
        this.saldoTotal = this.metasMes - this.gastosMes;
        this.transacoesRecentes = data
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, 5);
      },
      error: (err) => console.error('Erro ao carregar dashboard:', err)
    });
  }

  getIconName(categoria: string): string {
    const icons: { [key: string]: string } = {
      'Alimentação': 'restaurant',
      'Transporte': 'directions_car',
      'Assinaturas': 'subscriptions',
      'Lazer': 'movie',
      'Moradia': 'home',
      'Saúde': 'favorite'
    };
    return icons[categoria] || 'shopping_bag';
  }

  getIconColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'Alimentação': '#22c55e',
      'Transporte': '#f97316',
      'Assinaturas': '#3b82f6',
      'Lazer': '#a855f7',
      'Moradia': '#f59e0b',
      'Saúde': '#ef4444'
    };
    return colors[categoria] || '#6b7280';
  }
}
