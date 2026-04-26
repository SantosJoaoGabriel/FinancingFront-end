import { Component } from '@angular/core';
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
export class ReportsComponent {
  reportCards: ReportCard[] = [];
  reportHistory: ReportHistoryItem[] = [];

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

  constructor(private reportsService: ReportsService) {
    this.reportCards = this.reportsService.getReportCards();
    this.reportHistory = this.reportsService.getReportHistory();
  }

  generatePdf(report: ReportCard) {
    alert(`Gerando PDF: ${report.title}`);
  }

  downloadPdf(item: ReportHistoryItem) {
    alert(`Baixar arquivo: ${item.fileName}`);
  }
}
