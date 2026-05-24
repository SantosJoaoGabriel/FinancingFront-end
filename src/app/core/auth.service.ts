import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUser: UserResponse | null = null;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(user => {
        this.currentUser = user;
        // aqui depois podemos salvar token quando existir
      })
    );
  }

  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, data);
  }

  getUser(): UserResponse | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    // quando tiver token, limpamos aqui também
  }
}
