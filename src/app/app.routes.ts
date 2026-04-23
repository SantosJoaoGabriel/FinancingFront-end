import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { TransacoesComponent } from './transacoes/transacoes';
import { GanhosComponent } from './ganhos/ganhos';
import { ReportsComponent } from './reports/reports';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transacoes', component: TransacoesComponent },
  { path: 'ganhos', component: GanhosComponent },
  { path: 'reports', component: ReportsComponent }
];
