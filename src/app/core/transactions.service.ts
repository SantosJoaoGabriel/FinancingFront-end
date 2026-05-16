import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Transaction {
  id?: number;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'http://localhost:8080/api/transacoes';

  constructor(private http: HttpClient) {}

  getTransacoes(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getRecentes(limite: number = 5): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/recentes?limite=${limite}`);
  }

  addTransacao(transacao: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transacao);
  }

  updateTransacao(id: number, transacao: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transacao);
  }

  deleteTransacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
