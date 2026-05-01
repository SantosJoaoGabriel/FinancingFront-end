import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ExpensesComponent } from './expenses/expenses';
import { GainsComponent } from './gains/gains';
import { ReportsComponent } from './reports/reports';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'gains', component: GainsComponent },
  { path: 'reports', component: ReportsComponent }
];
