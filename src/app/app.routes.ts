import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'expenses', loadComponent: () => import('./expenses/expenses').then(m => m.ExpensesComponent) },
      { path: 'gains', loadComponent: () => import('./gains/gains').then(m => m.GainsComponent) },
      { path: 'reports', loadComponent: () => import('./reports/reports').then(m => m.ReportsComponent) }
    ]
  },

  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.RegisterComponent) },
  { path: '**', redirectTo: 'login' }
];
