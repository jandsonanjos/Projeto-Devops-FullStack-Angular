import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { Dashboard } from './app/dashboard';
import { Extrato } from './app/extrato';
import { Saldo } from './app/saldo';
import { PerfilComponent } from './app/perfil';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login').then(m => m.LoginComponent) },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'extrato', component: Extrato, canActivate: [AuthGuard] },
  { path: 'saldo', component: Saldo, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];