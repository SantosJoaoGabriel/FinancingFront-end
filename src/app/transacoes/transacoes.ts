import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransactionsService, Transacao } from '../core/transactions.service';

interface NovaTransacao {
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  paymentMethod: string;
  notes: string;
}

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transacoes.html',
  styleUrl: './transacoes.css'
})
export class TransacoesComponent {
  Math = Math;

  mostrarFormulario = false;

  dataSource: Transacao[] = [];
  filteredData: Transacao[] = [];

  searchTerm = '';
  filtroCategoria = '';
  filtroPayment = '';

  pageSize = 5;
  currentPage = 1;

  categorias: string[] = [
    'Alimentação', 'Transporte', 'Assinaturas', 'Lazer', 'Moradia', 'Saúde'
  ];

  paymentMethods: string[] = [
    'Credit Card', 'Debit Card', 'Cash', 'Pix'
  ];

  novaTransacao: NovaTransacao = this.emptyForm();

  constructor(private transactionsService: TransactionsService) {
    this.dataSource = this.transactionsService.getTransacoes();
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData(): Transacao[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  applyFilters() {
    this.filteredData = this.dataSource.filter(t => {
      const matchSearch = t.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = this.filtroCategoria ? t.categoria === this.filtroCategoria : true;
      return matchSearch && matchCat;
    });
    this.currentPage = 1;
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.novaTransacao = this.emptyForm();
    this.arquivosSelecionados = []; // limpar arquivos
  }

  adicionarTransacao() {
    if (!this.novaTransacao.descricao || !this.novaTransacao.categoria) return;

    this.transactionsService.addTransacao({
      descricao: this.novaTransacao.descricao,
      categoria: this.novaTransacao.categoria,
      data: this.novaTransacao.data,
      valor: this.novaTransacao.valor
    });

    this.dataSource = this.transactionsService.getTransacoes();
    this.applyFilters();
    this.fecharFormulario();
  }

  getCategoryIcon(cat: string): string {
    const icons: { [key: string]: string } = {
      'Alimentação': 'restaurant',
      'Transporte': 'directions_car',
      'Assinaturas': 'subscriptions',
      'Lazer': 'movie',
      'Moradia': 'home',
      'Saúde': 'favorite'
    };
    return icons[cat] || 'category';
  }

  getCategoryColor(cat: string): string {
    const colors: { [key: string]: string } = {
      'Alimentação': '#22c55e',
      'Transporte': '#3b82f6',
      'Assinaturas': '#a855f7',
      'Lazer': '#f97316',
      'Moradia': '#f59e0b',
      'Saúde': '#ef4444'
    };
    return colors[cat] || '#6b7280';
  }

  private emptyForm(): NovaTransacao {
    return {
      descricao: '',
      categoria: '',
      data: new Date().toISOString().substring(0, 10),
      valor: 0,
      paymentMethod: 'Credit Card',
      notes: ''
    };
  }
  // Upload de arquivos
arquivosSelecionados: File[] = [];

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.adicionarArquivos(Array.from(input.files));
  }
}

onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer?.files) {
    this.adicionarArquivos(Array.from(event.dataTransfer.files));
  }
}

adicionarArquivos(novos: File[]) {
  const validos = novos.filter(f => f.size <= 10 * 1024 * 1024); // max 10MB
  this.arquivosSelecionados = [...this.arquivosSelecionados, ...validos];
}

removerArquivo(index: number, event: MouseEvent) {
  event.stopPropagation();
  this.arquivosSelecionados.splice(index, 1);
}

getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'picture_as_pdf';
  if (['png', 'jpg', 'jpeg'].includes(ext || '')) return 'image';
  return 'insert_drive_file';
}

formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

}
