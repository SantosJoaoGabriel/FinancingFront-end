import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  ReportsService,
  ReportCard,
  ReportHistoryItem
} from '../core/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  reportCards: ReportCard[] = [];
  reportHistory: ReportHistoryItem[] = [];
  filteredHistory: ReportHistoryItem[] = [];

  displayedColumns: string[] = [
    'date',
    'title',
    'period',
    'format',
    'status',
    'actions'
  ];

  selectedCategory = 'Todos';
  selectedPeriod = 'Últimos 30 dias';
  loading = false;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.reportCards = this.reportsService.getReportCards();
    this.loadHistory();
  }

  loadHistory(): void {
    this.reportsService.getReportHistory().subscribe({
      next: (data) => {
        this.reportHistory = data;
        this.applyFilters();
      },
      error: () => {
        alert('Erro ao carregar histórico de relatórios.');
      }
    });
  }

  generatePdf(report: ReportCard): void {
    this.loading = true;

    this.reportsService.generateReport({ type: report.code }).subscribe({
      next: () => {
        this.loading = false;
        this.loadHistory();
        alert(`Relatório "${report.title}" gerado com sucesso.`);
      },
      error: () => {
        this.loading = false;
        alert(`Erro ao gerar relatório "${report.title}".`);
      }
    });
  }

  downloadPdf(item: ReportHistoryItem): void {
    this.reportsService.downloadReport(item.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Erro ao baixar arquivo.');
      }
    });
  }

  applyFilters(): void {
    this.filteredHistory = this.reportHistory.filter(item => {
      const matchesCategory =
        this.selectedCategory === 'Todos' ||
        item.category === this.selectedCategory;

      return matchesCategory;
    });
  }
}
