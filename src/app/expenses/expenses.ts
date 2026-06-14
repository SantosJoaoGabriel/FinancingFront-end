import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransactionsService, Transaction } from '../core/transactions.service';

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
export class ExpensesComponent implements OnInit, OnDestroy {
  Math = Math;
  mostrarFormulario = false;

  dataSource: Transaction[] = [];
  filteredData: Transaction[] = [];

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

  submitted = false;

  openMenuId: number | null = null;
  isEditMode = false;
  editingTransactionId: number | null = null;

  showDeleteModal = false;
  transactionToDeleteId: number | null = null;

  constructor(
    private transactionsService: TransactionsService,
  ) {}

  ngOnInit() {
    this.carregarTransacoes();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('expense-modal-open');
    document.body.classList.remove('delete-modal-open');
  }

  isCampoInvalido(campo: 'valor' | 'descricao' | 'categoria' | 'paymentMethod'): boolean {
    if (!this.submitted) return false;

    switch (campo) {
      case 'valor':
        return this.novaTransacao.valor === null ||
               this.novaTransacao.valor === undefined ||
               this.novaTransacao.valor <= 0;

      case 'descricao':
        return !this.novaTransacao.descricao?.trim() ||
               this.novaTransacao.descricao.trim().length > 20;

      case 'categoria':
        return !this.novaTransacao.categoria?.trim();

      case 'paymentMethod':
        return !this.novaTransacao.paymentMethod?.trim();

      default:
        return false;
    }
  }

  getMensagemErroValor(): string {
    if (!this.submitted) return '';

    if (this.novaTransacao.valor === null || this.novaTransacao.valor === undefined || this.novaTransacao.valor === 0) {
      return 'Campo obrigatório';
    }

    if (this.novaTransacao.valor < 0) {
      return 'Não pode ser negativo';
    }

    return '';
  }

  getMensagemErroDescricao(): string {
    if (!this.submitted) return '';

    const descricao = this.novaTransacao.descricao?.trim() || '';

    if (!descricao) {
      return 'Campo obrigatório';
    }

    if (descricao.length > 20) {
      return 'Máximo de 20 caracteres';
    }

    return '';
  }

  formularioValido(): boolean {
    return (
      !!this.novaTransacao.descricao?.trim() &&
      this.novaTransacao.descricao.trim().length <= 20 &&
      !!this.novaTransacao.categoria?.trim() &&
      !!this.novaTransacao.paymentMethod?.trim() &&
      !!this.novaTransacao.valor &&
      this.novaTransacao.valor > 0
    );
  }

  carregarTransacoes() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.dataSource = [...data];
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao carregar transações:', err)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData(): Transaction[] {
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
    this.filteredData = this.dataSource
      .filter(t => {
        const matchType = t.type === 'EXPENSE';

        const matchSearch = t.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

        const dataTransacao = new Date(t.date);
        const matchInicio = this.filtroDataInicio
          ? dataTransacao >= new Date(this.filtroDataInicio)
          : true;

        const matchFim = this.filtroDataFim
          ? dataTransacao <= new Date(this.filtroDataFim)
          : true;

        return matchType && matchSearch && matchInicio && matchFim;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.currentPage = 1;
  }

  limparFiltros() {
    this.searchTerm = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.applyFilters();
  }

  abrirFormulario() {
    this.submitted = false;
    this.mostrarFormulario = true;
    document.body.classList.add('expense-modal-open');
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.novaTransacao = this.emptyForm();
    this.arquivosSelecionados = [];
    this.submitted = false;
    document.body.classList.remove('expense-modal-open');
  }

  adicionarTransacao() {
    this.submitted = true;

    if (!this.formularioValido()) return;

    const payload: Transaction = {
      description: this.novaTransacao.descricao,
      category: this.novaTransacao.categoria,
      date: this.novaTransacao.data,
      amount: this.novaTransacao.valor,
      type: 'EXPENSE',
      paymentMethod: this.novaTransacao.paymentMethod,
      notes: this.novaTransacao.notes
    };

    if (this.isEditMode && this.editingTransactionId !== null) {
      this.transactionsService.updateTransacao(this.editingTransactionId, payload).subscribe({
        next: (transacaoAtualizada) => {
          this.dataSource = this.dataSource.map(item =>
            item.id === this.editingTransactionId ? transacaoAtualizada : item
          );
          this.applyFilters();
          this.fecharFormulario();
        },
        error: (err) => console.error('Erro ao atualizar transação:', err)
      });
    } else {
      this.transactionsService.addTransacao(payload).subscribe({
        next: (nova) => {
          this.dataSource = [nova, ...this.dataSource];
          this.applyFilters();
          this.fecharFormulario();
        },
        error: (err) => console.error('Erro ao adicionar transação:', err)
      });
    }
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
    this.arquivosSelecionados = [...this.arquivosSelecionados];
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
      paymentMethod: '',
      notes: ''
    };
  }

  toggleActionMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  editTransaction(id: number): void {
    const transaction = this.dataSource.find(item => item.id === id);

    if (!transaction) {
      return;
    }

    this.isEditMode = true;
    this.editingTransactionId = id;
    this.openMenuId = null;
    this.mostrarFormulario = true;
    this.submitted = false;
    document.body.classList.add('expense-modal-open');

    this.novaTransacao = {
      descricao: transaction.description,
      categoria: transaction.category,
      data: transaction.date,
      valor: transaction.amount,
      paymentMethod: transaction.paymentMethod || 'Cartão de Crédito',
      notes: transaction.notes || ''
    };
  }

  deleteTransaction(id: number): void {
    this.transactionToDeleteId = id;
    this.showDeleteModal = true;
    this.openMenuId = null;
    document.body.classList.add('delete-modal-open');
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.transactionToDeleteId = null;
    document.body.classList.remove('delete-modal-open');
  }

  confirmDelete(): void {
    if (this.transactionToDeleteId === null) {
      return;
    }

    this.transactionsService.deleteTransacao(this.transactionToDeleteId).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(item => item.id !== this.transactionToDeleteId);
        this.applyFilters();
        this.showDeleteModal = false;
        this.transactionToDeleteId = null;
        document.body.classList.remove('delete-modal-open');
      },
      error: (error) => {
        console.error('Erro ao excluir transação', error);
        this.showDeleteModal = false;
        this.transactionToDeleteId = null;
        document.body.classList.remove('delete-modal-open');
      }
    });
  }
}
