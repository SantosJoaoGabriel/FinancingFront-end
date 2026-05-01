import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Ganho {
  id?: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  paymentMethod?: string;
  notes?: string;
}

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

  dataSource: Ganho[] = [];
  filteredData: Ganho[] = [];

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

  private apiUrl = 'http://localhost:8080/api/ganhos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarGanhos();
  }

  carregarGanhos() {
    this.dataSource = [
      { id: 1, descricao: 'Salário Mensal', categoria: 'Salário', data: '2026-04-05', valor: 5000, paymentMethod: 'Transferência' },
      { id: 2, descricao: 'Projeto Freelance', categoria: 'Freelance', data: '2026-04-10', valor: 1500, paymentMethod: 'PIX' },
      { id: 3, descricao: 'Dividendos', categoria: 'Investimentos', data: '2026-04-12', valor: 320, paymentMethod: 'Transferência' },
    ];
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData(): Ganho[] {
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

      const dataGanho = new Date(t.data);
      const matchInicio = this.filtroDataInicio
        ? dataGanho >= new Date(this.filtroDataInicio)
        : true;
      const matchFim = this.filtroDataFim
        ? dataGanho <= new Date(this.filtroDataFim)
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
    this.novoGanho = this.emptyForm();
    this.arquivosSelecionados = [];
  }

  adicionarGanho() {
    if (!this.novoGanho.descricao || !this.novoGanho.categoria) return;

    const novo: Ganho = {
      descricao: this.novoGanho.descricao,
      categoria: this.novoGanho.categoria,
      data: this.novoGanho.data,
      valor: this.novoGanho.valor,
      paymentMethod: this.novoGanho.paymentMethod,
      notes: this.novoGanho.notes
    };

    this.dataSource = [...this.dataSource, novo];
    this.applyFilters();
    this.fecharFormulario();
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
      paymentMethod: 'PIX',
      notes: ''
    };
  }
}
