import { Component } from '@angular/core';
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
export class DashboardComponent {
  saldoTotal = 0;
  gastosMes = 0;
  metasMes = 3000;

  transacoes: Transacao[] = [];
  transacoesRecentes: Transacao[] = [];

  constructor(private transactionsService: TransactionsService) {
    this.transacoes = this.transactionsService.getTransacoes();
    this.calcularResumo();

    // Pegar as 5 mais recentes
    this.transacoesRecentes = this.transacoes
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  }

  private calcularResumo() {
    this.gastosMes = this.transacoes.reduce((total, t) => total + t.valor, 0);
    this.saldoTotal = this.metasMes - this.gastosMes;
  }

  getIconName(categoria: string): string {
    const icons: { [key: string]: string } = {
      'Alimentação': 'restaurant',
      'Transporte': 'directions_car',
      'Assinaturas': 'subscriptions',
      'Lazer': 'movie'
    };
    return icons[categoria] || 'shopping_bag';
  }

  getIconColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'Alimentação': '#22c55e',
      'Transporte': '#f97316',
      'Assinaturas': '#3b82f6',
      'Lazer': '#a855f7'
    };
    return colors[categoria] || '#6b7280';
  }
}
