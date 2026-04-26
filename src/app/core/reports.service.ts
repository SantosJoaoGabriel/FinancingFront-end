import { Injectable } from '@angular/core';

export interface ReportCard {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  buttonText: string;
}

export interface ReportHistoryItem {
  date: string;
  title: string;
  description: string;
  period: string;
  format: 'PDF';
  status: 'Concluído' | 'Processando';
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  getReportCards(): ReportCard[] {
    return [
      {
        id: 1,
        title: 'Relatório mensal',
        subtitle: 'Conciliação completa de entradas e saídas do mês vigente.',
        type: 'Mensal',
        buttonText: 'Gerar PDF'
      },
      {
        id: 2,
        title: 'Gastos por categoria',
        subtitle: 'Distribuição percentual de despesas operacionais e fixas.',
        type: 'Analítico',
        buttonText: 'Gerar PDF'
      },
      {
        id: 3,
        title: 'Resumo anual',
        subtitle: 'Visão consolidada das movimentações financeiras do ano.',
        type: 'Anual',
        buttonText: 'Gerar PDF'
      }
    ];
  }

  getReportHistory(): ReportHistoryItem[] {
    return [
      {
        date: '2026-04-20',
        title: 'Fechamento mensal - Setembro',
        description: 'Relatório do fluxo de caixa operacional.',
        period: '01/09/2025 - 30/09/2025',
        format: 'PDF',
        status: 'Concluído',
        fileName: 'fechamento-mensal-setembro.pdf'
      },
      {
        date: '2026-04-18',
        title: 'Analítico por categoria',
        description: 'Despesas agrupadas por categoria.',
        period: '01/04/2026 - 18/04/2026',
        format: 'PDF',
        status: 'Concluído',
        fileName: 'analitico-categorias.pdf'
      },
      {
        date: '2026-04-15',
        title: 'Resumo anual consolidado',
        description: 'Extrato consolidado do exercício atual.',
        period: '01/01/2026 - 15/04/2026',
        format: 'PDF',
        status: 'Processando',
        fileName: 'resumo-anual.pdf'
      }
    ];
  }
}
