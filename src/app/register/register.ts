import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

  get senhasDiferentes(): boolean {
    return !!this.confirmarSenha && this.senha !== this.confirmarSenha;
  }

  onSubmit(): void {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      alert('Preencha todos os campos.');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    if (!this.aceitarTermos) {
      alert('Você precisa aceitar os termos.');
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      alert('Usuário criado com sucesso!');
      this.router.navigate(['/login']);
    }, 1200);
  }
}
