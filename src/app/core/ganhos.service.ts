import { Injectable } from '@angular/core';

export interface Ganho {
  data: string;
  descricao: string;
  categoria: string;
  metodo: string;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class GanhosService {
  private ganhos: Ganho[] = [
    {
      data: '2026-04-02',
      descricao: 'Salário mensal',
      categoria: 'Salário',
      metodo: 'Transferência',
      valor: 3500
    },
    {
      data: '2026-04-05',
      descricao: 'Freelance landing page',
      categoria: 'Freelance',
      metodo: 'Pix',
      valor: 800
    },
    {
      data: '2026-04-09',
      descricao: 'Venda notebook usado',
      categoria: 'Vendas',
      metodo: 'Dinheiro',
      valor: 1200
    }
  ];

  getGanhos(): Ganho[] {
    return this.ganhos;
  }

  addGanho(novo: Ganho) {
    this.ganhos = [...this.ganhos, novo];
  }
}
