import { Injectable } from '@angular/core';

export interface ReportItem {
  id: number;
  date: string;
  title: string;
  category: string;
  format: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  getReports(): ReportItem[] {
    return [
      {
        id: 1,
        date: '2026-04-01',
        title: 'Relatório mensal',
        category: 'Financeiro',
        format: 'PDF',
        fileName: 'relatorio-mensal.pdf'
      },
      {
        id: 2,
        date: '2026-04-01',
        title: 'Relatório por categoria',
        category: 'Categorias',
        format: 'PDF',
        fileName: 'relatorio-categorias.pdf'
      },
      {
        id: 3,
        date: '2026-04-01',
        title: 'Relatório anual',
        category: 'Resumo anual',
        format: 'PDF',
        fileName: 'relatorio-anual.pdf'
      }
    ];
  }
}
