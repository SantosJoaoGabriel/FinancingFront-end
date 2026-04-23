import { Injectable } from '@angular/core';

export interface ReportItem {
  id: number;
  title: string;
  description: string;
  fileName: string;
  format: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  getReports(): ReportItem[] {
    return [
      {
        id: 1,
        title: 'Relatório mensal',
        description: 'Resumo das receitas e despesas do mês atual.',
        fileName: 'relatorio-mensal.pdf',
        format: 'PDF'
      },
      {
        id: 2,
        title: 'Relatório por categoria',
        description: 'Agrupamento dos gastos e ganhos por categoria.',
        fileName: 'relatorio-categorias.pdf',
        format: 'PDF'
      },
      {
        id: 3,
        title: 'Relatório anual',
        description: 'Visão consolidada das movimentações financeiras do ano.',
        fileName: 'relatorio-anual.pdf',
        format: 'PDF'
      }
    ];
  }
}
