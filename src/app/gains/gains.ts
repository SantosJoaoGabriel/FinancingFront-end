import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransactionsService, Transaction } from '../core/transactions.service';

interface NovoGanho {
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  paymentMethod: string;
  notes: string;
}

@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gains.html',
  styleUrls: ['./gains.css']
})
export class GainsComponent implements OnInit {
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
    'Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Vendas', 'Outros'
  ];

  paymentMethods: string[] = [
    'PIX', 'Transferência', 'Dinheiro', 'Depósito'
  ];

  novoGanho: NovoGanho = this.emptyForm();
  arquivosSelecionados: File[] = [];

  submitted = false;

isCampoInvalido(campo: 'valor' | 'descricao' | 'categoria' | 'paymentMethod'): boolean {
  if (!this.submitted) return false;

  switch (campo) {
    case 'valor':
      return this.novoGanho.valor === null ||
             this.novoGanho.valor === undefined ||
             this.novoGanho.valor <= 0;

    case 'descricao':
      return !this.novoGanho.descricao?.trim() ||
             this.novoGanho.descricao.trim().length > 20;

    case 'categoria':
      return !this.novoGanho.categoria?.trim();

    case 'paymentMethod':
      return !this.novoGanho.paymentMethod?.trim();

    default:
      return false;
  }
}

getMensagemErroValor(): string {
  if (!this.submitted) return '';

  if (this.novoGanho.valor === null || this.novoGanho.valor === undefined || this.novoGanho.valor === 0) {
    return 'Campo obrigatório';
  }

  if (this.novoGanho.valor < 0) {
    return 'Não pode ser negativo';
  }

  return '';
}

getMensagemErroDescricao(): string {
  if (!this.submitted) return '';

  const descricao = this.novoGanho.descricao?.trim() || '';

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
    !!this.novoGanho.descricao?.trim() &&
    this.novoGanho.descricao.trim().length <= 20 &&
    !!this.novoGanho.categoria?.trim() &&
    !!this.novoGanho.paymentMethod?.trim() &&
    !!this.novoGanho.valor &&
    this.novoGanho.valor > 0
  );
}

  private apiUrl = 'http://localhost:8080/api/ganhos';

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.carregarGanhos();
  }

  carregarGanhos() {
    this.transactionsService.getTransacoes().subscribe({
      next: (data) => {
        this.dataSource = data.filter(t => t.type === 'INCOME');
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao carregar ganhos:', err)
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
        const matchType = t.type === 'INCOME';

        const matchSearch = t.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

        const dataGanho = new Date(t.date);
        const matchInicio = this.filtroDataInicio
          ? dataGanho >= new Date(this.filtroDataInicio)
          : true;

        const matchFim = this.filtroDataFim
          ? dataGanho <= new Date(this.filtroDataFim)
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
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.novoGanho = this.emptyForm();
    this.arquivosSelecionados = [];
    this.submitted = false;
  }

  salvarGanho(): void {
    this.submitted = true;

    if (!this.formularioValido()) {
      return;
    }

    const payload: Transaction = {
      description: this.novoGanho.descricao,
      category: this.novoGanho.categoria,
      date: this.novoGanho.data,
      amount: this.novoGanho.valor,
      type: 'INCOME',
      paymentMethod: this.novoGanho.paymentMethod,
      notes: this.novoGanho.notes
    };

    if (this.isEditMode && this.editingTransactionId !== null) {
      this.transactionsService.updateTransacao(this.editingTransactionId, payload).subscribe({
        next: () => {
          this.carregarGanhos();
          this.fecharFormulario();
        },
        error: (error) => {
          console.error('Erro ao atualizar transação', error);
        }
      });
      return;
    }

    this.transactionsService.addTransacao(payload).subscribe({
      next: () => {
        this.carregarGanhos();
        this.fecharFormulario();
      },
      error: (error) => {
        console.error('Erro ao adicionar transação', error);
      }
    });
  }

  getCategoryIcon(cat: string): string {
    const icons: { [key: string]: string } = {
      'Salário': 'work',
      'Freelance': 'laptop',
      'Investimentos': 'trending_up',
      'Aluguel': 'home',
      'Vendas': 'sell',
      'Outros': 'attach_money'
    };
    return icons[cat] || 'attach_money';
  }

  getCategoryIconClass(cat: string): string {
    const classes: { [key: string]: string } = {
      'Salário': 'icon-salario',
      'Freelance': 'icon-freelance',
      'Investimentos': 'icon-investimentos',
      'Aluguel': 'icon-aluguel',
      'Vendas': 'icon-vendas',
      'Outros': 'icon-outros'
    };
    return classes[cat] || 'icon-default';
  }

  getCategoryBadgeClass(cat: string): string {
    const classes: { [key: string]: string } = {
      'Salário': 'badge-salario',
      'Freelance': 'badge-freelance',
      'Investimentos': 'badge-investimentos',
      'Aluguel': 'badge-aluguel',
      'Vendas': 'badge-vendas',
      'Outros': 'badge-outros'
    };
    return classes[cat] || 'badge-default';
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

  private emptyForm(): NovoGanho {
    return {
      descricao: '',
      categoria: '',
      data: new Date().toISOString().substring(0, 10),
      valor: 0,
      paymentMethod: '',
      notes: ''
    };
  }

    openMenuId: number | null = null;

  toggleActionMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  isEditMode = false;
  editingTransactionId: number | null = null;

    editTransaction(id: number): void {
    const transaction = this.dataSource.find(item => item.id === id);


    if (!transaction) {
      return;
    }

    this.isEditMode = true;
    this.editingTransactionId = id;
    this.openMenuId = null;
    this.submitted = false;
    this.mostrarFormulario = true;

    this.novoGanho = {
      descricao: transaction.description,
      categoria: transaction.category,
      data: transaction.date,
      valor: transaction.amount,
      paymentMethod: transaction.paymentMethod || 'Pix',
      notes: transaction.notes || ''
    };
  }


  showDeleteModal = false;
  transactionToDeleteId: number | null = null;

  deleteTransaction(id: number): void {
    this.transactionToDeleteId = id;
    this.showDeleteModal = true;
    this.openMenuId = null;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.transactionToDeleteId = null;
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
      },
      error: (error) => {
        console.error('Erro ao excluir transação', error);
        this.showDeleteModal = false;
        this.transactionToDeleteId = null;
      }
    });
  }
}
