import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GanhosService, Ganho } from '../core/ganhos.service';

@Component({
  selector: 'app-ganhos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ganhos.html',
  styleUrl: './ganhos.css'
})
export class GanhosComponent {
  displayedColumns: string[] = ['data', 'descricao', 'categoria', 'metodo', 'valor'];
  dataSource: Ganho[] = [];

  novoGanho: Ganho = {
    data: new Date().toISOString().substring(0, 10),
    descricao: '',
    categoria: '',
    metodo: '',
    valor: 0
  };

  constructor(private ganhosService: GanhosService) {
    this.dataSource = this.ganhosService.getGanhos();
  }

  adicionarGanho() {
    if (
      !this.novoGanho.descricao ||
      !this.novoGanho.categoria ||
      !this.novoGanho.metodo ||
      this.novoGanho.valor <= 0
    ) {
      return;
    }

    this.ganhosService.addGanho({ ...this.novoGanho });
    this.dataSource = this.ganhosService.getGanhos();

    this.novoGanho = {
      data: new Date().toISOString().substring(0, 10),
      descricao: '',
      categoria: '',
      metodo: '',
      valor: 0
    };
  }
}
