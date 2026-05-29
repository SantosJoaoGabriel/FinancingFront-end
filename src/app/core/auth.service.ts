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

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUser: UserResponse | null = null;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.token = response.token;
        this.currentUser = response.user;

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, data);
  }

  getUser(): UserResponse | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    this.currentUser = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private loadSession(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token) {
      this.token = token;
    }

    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }
}
