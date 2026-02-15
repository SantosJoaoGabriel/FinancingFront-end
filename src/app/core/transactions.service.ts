import { Injectable } from '@angular/core';

export interface Transacao {
  descricao: string;
  categoria: string;
  data: string; // ISO
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private transacoes: Transacao[] = [
    { descricao: 'Supermercado', categoria: 'Alimentação', data: '2026-02-10', valor: 250.90 },
    { descricao: 'Uber', categoria: 'Transporte', data: '2026-02-11', valor: 35.50 },
    { descricao: 'Netflix', categoria: 'Assinaturas', data: '2026-02-05', valor: 39.90 },
    { descricao: 'Lanche', categoria: 'Alimentação', data: '2026-02-12', valor: 22.00 },
    { descricao: 'Cinema', categoria: 'Lazer', data: '2026-02-08', valor: 60.00 },
  ];

  getTransacoes(): Transacao[] {
    return this.transacoes;
  }

  addTransacao(nova: Transacao) {
    this.transacoes = [...this.transacoes, nova];
  }
}
