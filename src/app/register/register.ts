import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  aceitarTermos = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get senhasDiferentes(): boolean {
    return !!this.confirmarSenha && this.senha !== this.confirmarSenha;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (!this.aceitarTermos) {
      this.errorMessage = 'Você precisa aceitar os termos.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.register({
      name: this.nome,
      email: this.email,
      password: this.senha
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Usuário criado com sucesso!';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor.';
        } else {
          this.errorMessage =
            error?.error?.message ||
            error?.error ||
            'Não foi possível criar a conta.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}
