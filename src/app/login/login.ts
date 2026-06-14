import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPreferenciasLogin();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  carregarPreferenciasLogin(): void {
    const remember = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    this.rememberMe = remember === 'true';
    if (this.rememberMe && rememberedEmail) {
      this.email = rememberedEmail;
    }
  }

  salvarPreferenciasLogin(): void {
    if (this.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', this.email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha e-mail e senha.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.login({
      email: this.email,
      password: this.password
    }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.salvarPreferenciasLogin();
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor.';
        } else {
          this.errorMessage =
            error?.error?.message ||
            'E-mail ou senha incorretos.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}
