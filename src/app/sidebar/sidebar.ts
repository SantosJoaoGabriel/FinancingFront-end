import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutStateService } from '../core/layout-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  opened = true;
  userMenuOpen = false;
  showLogoutModal = false;
  hideSidebar = false;

  usuarioNome = 'Usuário';
  usuarioEmail = '';
  usuarioInicial = 'U';
  tokenParcial = '';

  private sidebarStateSubscription?: Subscription;

  constructor(
    private router: Router,
    private layoutStateService: LayoutStateService
  ) {
    this.carregarUsuarioLogado();
  }

  ngOnInit(): void {
    this.sidebarStateSubscription = this.layoutStateService.sidebarHidden$
      .subscribe(hidden => {
        this.hideSidebar = hidden;
      });
  }

  ngOnDestroy(): void {
    this.sidebarStateSubscription?.unsubscribe();
  }

  toggle() {
    this.opened = !this.opened;
  }

  toggleUserMenu(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  abrirConfirmacaoLogout(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showLogoutModal = true;
  }

  cancelarLogout() {
    this.showLogoutModal = false;
  }

  confirmarLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('authUser');
    this.userMenuOpen = false;
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }

  carregarUsuarioLogado() {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenParcial = token.length > 12 ? `${token.substring(0, 12)}...` : token;
    }

    const userStorage =
      localStorage.getItem('user') ||
      localStorage.getItem('usuario') ||
      localStorage.getItem('authUser');

    if (userStorage) {
      try {
        const user = JSON.parse(userStorage);
        this.usuarioNome = user.name || user.nome || user.username || 'Usuário';
        this.usuarioEmail = user.email || '';
        this.usuarioInicial = this.usuarioNome.charAt(0).toUpperCase();
      } catch {
      }
    }

    if (!token) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!this.usuarioNome || this.usuarioNome === 'Usuário') {
        this.usuarioNome =
          payload.name ||
          payload.nome ||
          payload.preferred_username ||
          payload.sub ||
          'Usuário';
      }

      if (!this.usuarioEmail) {
        this.usuarioEmail = payload.email || payload.user_email || '';
      }

      this.usuarioInicial = this.usuarioNome.charAt(0).toUpperCase();
    } catch (error) {
      console.error('Erro ao carregar dados do usuário logado:', error);
    }
  }

  @HostListener('document:click')
  fecharMenuUsuario() {
    this.userMenuOpen = false;
  }
}
