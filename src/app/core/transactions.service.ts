import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transacao {
  id?: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  paymentMethod?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'http://localhost:8080/api/transacoes';

  constructor(private http: HttpClient) {}

  getTransacoes(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl);
  }

  getRecentes(limite: number = 5): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(`${this.apiUrl}/recentes?limite=${limite}`);
  }

  addTransacao(transacao: Transacao): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, transacao);
  }

  updateTransacao(id: number, transacao: Transacao): Observable<Transacao> {
    return this.http.put<Transacao>(`${this.apiUrl}/${id}`, transacao);
  }

  deleteTransacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
