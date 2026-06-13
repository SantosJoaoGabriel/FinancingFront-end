import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  @ViewChild('feedbackDialog') feedbackDialog!: TemplateRef<any>;

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

  selectedReportToDelete: ReportHistoryItem | null = null;
  private deleteDialogRef: MatDialogRef<any> | null = null;

  feedbackTitle = '';
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  private feedbackDialogRef: MatDialogRef<any> | null = null;

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog
  ) {}

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
        this.openFeedbackDialog(
          'Erro ao carregar histórico',
          'Não foi possível carregar o histórico de relatórios.',
          'error'
        );
      }
    });
  }

  generatePdf(report: ReportCard): void {
    this.loading = true;

    this.reportsService.generateReport({ type: report.code }).subscribe({
      next: () => {
        this.loading = false;
        this.loadHistory();
        this.openFeedbackDialog(
          'Relatório gerado',
          `Relatório "${report.title}" gerado com sucesso.`,
          'success'
        );
      },
      error: () => {
        this.loading = false;
        this.openFeedbackDialog(
          'Erro ao gerar relatório',
          `Não foi possível gerar o relatório "${report.title}".`,
          'error'
        );
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
        this.openFeedbackDialog(
          'Erro ao baixar arquivo',
          'Não foi possível baixar o arquivo do relatório.',
          'error'
        );
      }
    });
  }

  deleteReport(item: ReportHistoryItem): void {
    this.selectedReportToDelete = item;

    this.deleteDialogRef = this.dialog.open(this.deleteDialog, {
      width: '560px',
      maxWidth: '92vw',
      disableClose: true,
      panelClass: 'delete-dialog-panel'
    });
  }

  cancelDelete(): void {
    this.selectedReportToDelete = null;
    this.deleteDialogRef?.close();
  }

  confirmDelete(): void {
    if (!this.selectedReportToDelete) {
      return;
    }

    const reportId = this.selectedReportToDelete.id;
    const reportTitle = this.selectedReportToDelete.title;

    this.reportsService.deleteReport(reportId).subscribe({
      next: () => {
        this.reportHistory = this.reportHistory.filter(report => report.id !== reportId);
        this.applyFilters();
        this.cancelDelete();
        this.openFeedbackDialog(
          'Relatório excluído',
          `O relatório "${reportTitle}" foi excluído com sucesso.`,
          'success'
        );
      },
      error: () => {
        this.openFeedbackDialog(
          'Erro ao excluir relatório',
          'Não foi possível excluir o relatório selecionado.',
          'error'
        );
      }
    });
  }

  openFeedbackDialog(title: string, message: string, type: 'success' | 'error'): void {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackType = type;

    this.feedbackDialogRef = this.dialog.open(this.feedbackDialog, {
      width: '440px',
      maxWidth: '90vw',
      disableClose: true,
      panelClass: 'feedback-dialog-panel'
    });
  }

  closeFeedbackDialog(): void {
    this.feedbackDialogRef?.close();
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
