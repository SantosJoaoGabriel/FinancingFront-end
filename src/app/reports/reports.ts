import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReportsService, ReportItem } from '../core/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {
  reports: ReportItem[] = [];

  constructor(private reportsService: ReportsService) {
    this.reports = this.reportsService.getReports();
  }

  downloadReport(report: ReportItem) {
    alert(`Download do arquivo: ${report.fileName}`);
  }
}
