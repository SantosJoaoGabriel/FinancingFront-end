import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Relatorio {
  id: number;
  nome: string;
  titulo: string;
  descricao: string;
  periodo: string;
  categoria: string;
  formato: string;
  tamanho: string;
  status: string;
  data: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {

  sidebarOpen = true;
  showModal = false;

  // Filtros
  filtroCategoria: string = '';
  filtroPeriodo: string = '';
  filterType: string = '';
  filterStatus: string = '';

  // Paginação
  currentPage = 1;
  itemsPerPage = 8;

  // Resumo
  totalReceitas = 8450.00;
  totalDespesas = 5230.00;
  saldoLiquido = 3220.00;

relatorios: Relatorio[] = [
  { id: 1, nome: 'Relatório Mensal - Abril', titulo: 'Relatório Mensal - Abril', descricao: 'Resumo completo de abril 2026', periodo: 'Abril 2026', categoria: 'Geral', formato: 'pdf', tamanho: '2.4 MB', status: 'confirmed', data: '25/04/2026' },
  { id: 2, nome: 'Relatório por Categoria', titulo: 'Relatório por Categoria', descricao: 'Gastos separados por categoria', periodo: 'Abril 2026', categoria: 'Alimentação', formato: 'xlsx', tamanho: '1.1 MB', status: 'confirmed', data: '24/04/2026' },
  { id: 3, nome: 'Relatório Anual 2025', titulo: 'Relatório Anual 2025', descricao: 'Visão geral do ano de 2025', periodo: 'Jan - Dez 2025', categoria: 'Geral', formato: 'pdf', tamanho: '5.8 MB', status: 'confirmed', data: '01/01/2026' },
  { id: 4, nome: 'Relatório Mensal - Março', titulo: 'Relatório Mensal - Março', descricao: 'Resumo completo de março 2026', periodo: 'Março 2026', categoria: 'Geral', formato: 'pdf', tamanho: '2.2 MB', status: 'confirmed', data: '31/03/2026' },
  { id: 5, nome: 'Relatório de Transporte', titulo: 'Relatório de Transporte', descricao: 'Gastos com transporte em abril', periodo: 'Abril 2026', categoria: 'Transporte', formato: 'xlsx', tamanho: '0.8 MB', status: 'pending', data: '20/04/2026' },
  { id: 6, nome: 'Relatório de Saúde', titulo: 'Relatório de Saúde', descricao: 'Despesas com saúde em abril', periodo: 'Abril 2026', categoria: 'Saúde', formato: 'pdf', tamanho: '1.3 MB', status: 'confirmed', data: '18/04/2026' },
];

  get relatoriosFiltrados(): Relatorio[] {
    return this.relatorios.filter(r => {
      const matchCategoria = !this.filtroCategoria || r.categoria === this.filtroCategoria;
      const matchPeriodo = !this.filtroPeriodo || r.periodo.toLowerCase().includes(this.filtroPeriodo.toLowerCase());
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      return matchCategoria && matchPeriodo && matchStatus;
    });
  }

  get paginatedRelatorios(): Relatorio[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.relatoriosFiltrados.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.relatoriosFiltrados.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  gerarRelatorio(tipo: string): void {
    console.log('Gerando relatório:', tipo);
    this.openModal();
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.filtroCategoria = '';
    this.filtroPeriodo = '';
    this.filterStatus = '';
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  exportReport(): void {
    console.log('Exportando relatório...');
  }

  isPdf(formato: string): boolean {
    return formato === 'pdf';
  }

  isConcluido(status: string): boolean {
    return status === 'confirmed';
  }

  baixar(relatorio: Relatorio): void {
    console.log('Baixando:', relatorio.nome);
  }

  editar(index: number): void {
    const relatorio = this.paginatedRelatorios[index];
    console.log('Editar:', relatorio);
  }

  deletar(index: number): void {
    const relatorio = this.paginatedRelatorios[index];
    this.relatorios = this.relatorios.filter(r => r.id !== relatorio.id);
  }

    visualizar(relatorio: Relatorio): void {
    console.log('Visualizando:', relatorio.nome);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  }

  getAmountClass(value: number): string {
    return value >= 0 ? 'positive' : 'negative';
  }
}
