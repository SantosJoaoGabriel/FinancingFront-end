import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportCard {
  id: number;
  code: 'MONTHLY' | 'CATEGORY' | 'ANNUAL';
  title: string;
  subtitle: string;
  type: string;
  buttonText: string;
}

export interface ReportHistoryItem {
  id: number;
  date: string;
  title: string;
  description: string;
  period: string;
  format: 'PDF';
  status: 'Concluído' | 'Processando';
  fileName: string;
  category: 'Financeiro' | 'Analítico' | 'Anual';
}

export interface GenerateReportRequest {
  type: 'MONTHLY' | 'CATEGORY' | 'ANNUAL';
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getReportCards(): ReportCard[] {
    return [
      {
        id: 1,
        code: 'MONTHLY',
        title: 'Relatório mensal',
        subtitle: 'Conciliação completa de entradas e saídas do mês vigente.',
        type: 'Mensal',
        buttonText: 'Gerar PDF'
      },
      {
        id: 2,
        code: 'CATEGORY',
        title: 'Gastos por categoria',
        subtitle: 'Distribuição percentual de despesas operacionais e fixas.',
        type: 'Analítico',
        buttonText: 'Gerar PDF'
      },
      {
        id: 3,
        code: 'ANNUAL',
        title: 'Resumo anual',
        subtitle: 'Visão consolidada das movimentações financeiras do ano.',
        type: 'Anual',
        buttonText: 'Gerar PDF'
      }
    ];
  }

  getReportHistory(): Observable<ReportHistoryItem[]> {
    return this.http.get<ReportHistoryItem[]>(`${this.apiUrl}/history`);
  }

  generateReport(data: GenerateReportRequest): Observable<ReportHistoryItem> {
    return this.http.post<ReportHistoryItem>(`${this.apiUrl}/generate`, data);
  }

  downloadReport(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }
}
