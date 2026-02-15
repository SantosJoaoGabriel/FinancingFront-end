import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TransactionsService, Transacao } from '../core/transactions.service';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './transacoes.html',
  styleUrl: './transacoes.css'
})
export class TransacoesComponent {
  displayedColumns: string[] = ['descricao', 'categoria', 'data', 'valor'];
  dataSource: Transacao[] = [];

  novaTransacao: Transacao = {
    descricao: '',
    categoria: '',
    data: new Date().toISOString().substring(0, 10), // yyyy-MM-dd
    valor: 0
  };

  constructor(private transactionsService: TransactionsService) {
    this.dataSource = this.transactionsService.getTransacoes();
  }

  adicionarTransacao() {
    if (!this.novaTransacao.descricao || !this.novaTransacao.categoria) {
      return;
    }

    this.transactionsService.addTransacao({ ...this.novaTransacao });

    // atualizar a tabela
    this.dataSource = this.transactionsService.getTransacoes();

    // limpar campos (mantendo data)
    this.novaTransacao = {
      descricao: '',
      categoria: '',
      data: new Date().toISOString().substring(0, 10),
      valor: 0
    };
  }
}
