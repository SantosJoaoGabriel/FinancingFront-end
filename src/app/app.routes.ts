import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { TransacoesComponent } from './transacoes/transacoes';
import { GanhosComponent } from './ganhos/ganhos';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transacoes', component: TransacoesComponent },
  { path: 'ganhos', component: GanhosComponent },
];
