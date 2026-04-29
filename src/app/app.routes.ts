import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ExpensesComponent } from './expenses/expenses';
import { GanhosComponent } from './ganhos/ganhos';
import { ReportsComponent } from './reports/reports';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'ganhos', component: GanhosComponent },
  { path: 'reports', component: ReportsComponent }
];
