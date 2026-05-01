import { Component, OnInit } from '@angular/core';
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
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.css']
})
export class ExpensesComponent implements OnInit {
  Math = Math;
  mostrarFormulario = false;

  dataSource: Transacao[] = [];
  filteredData: Transacao[] = [];

  searchTerm = '';
  filtroDataInicio = '';
  filtroDataFim = '';

  pageSize = 5;
  currentPage = 1;

  categorias: string[] = [
    'Alimentação', 'Transporte', 'Assinaturas', 'Lazer', 'Moradia', 'Saúde'
  ];

  paymentMethods: string[] = [
    'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix'
  ];

  novaTransacao: NovaTransacao = this.emptyForm();
  arquivosSelecionados: File[] = [];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.carregarTransacoes();
  }

  carregarTransacoes() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao carregar transações:', err)
    });
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

      const dataTransacao = new Date(t.data);
      const matchInicio = this.filtroDataInicio
        ? dataTransacao >= new Date(this.filtroDataInicio)
        : true;
      const matchFim = this.filtroDataFim
        ? dataTransacao <= new Date(this.filtroDataFim)
        : true;

      return matchSearch && matchInicio && matchFim;
    });
    this.currentPage = 1;
  }

  limparFiltros() {
    this.searchTerm = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.applyFilters();
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.novaTransacao = this.emptyForm();
    this.arquivosSelecionados = [];
  }

  adicionarTransacao() {
    if (!this.novaTransacao.descricao || !this.novaTransacao.categoria) return;

    this.transactionsService.addTransacao({
      descricao: this.novaTransacao.descricao,
      categoria: this.novaTransacao.categoria,
      data: this.novaTransacao.data,
      valor: this.novaTransacao.valor,
      paymentMethod: this.novaTransacao.paymentMethod,
      notes: this.novaTransacao.notes
    }).subscribe({
      next: () => {
        this.carregarTransacoes();
        this.fecharFormulario();
      },
      error: (err) => console.error('Erro ao adicionar transação:', err)
    });
  }

  getCategoryIconClass(cat: string): string {
    const classes: { [key: string]: string } = {
      'Alimentação': 'icon-alimentacao',
      'Transporte': 'icon-transporte',
      'Assinaturas': 'icon-assinaturas',
      'Lazer': 'icon-lazer',
      'Moradia': 'icon-moradia',
      'Saúde': 'icon-saude'
    };
    return classes[cat] || 'icon-default';
  }

  getCategoryBadgeClass(cat: string): string {
    const classes: { [key: string]: string } = {
      'Alimentação': 'badge-alimentacao',
      'Transporte': 'badge-transporte',
      'Assinaturas': 'badge-assinaturas',
      'Lazer': 'badge-lazer',
      'Moradia': 'badge-moradia',
      'Saúde': 'badge-saude'
    };
    return classes[cat] || 'badge-default';
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
      'Alimentação': '#ea580c',
      'Transporte': '#2563eb',
      'Assinaturas': '#9333ea',
      'Lazer': '#db2777',
      'Moradia': '#d97706',
      'Saúde': '#dc2626'
    };
    return colors[cat] || '#475569';
  }

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
    const validos = novos.filter(f => f.size <= 10 * 1024 * 1024);
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

  private emptyForm(): NovaTransacao {
    return {
      descricao: '',
      categoria: '',
      data: new Date().toISOString().substring(0, 10),
      valor: 0,
      paymentMethod: 'Cartão de Crédito',
      notes: ''
    };
  }
}
