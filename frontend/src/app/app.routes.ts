import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cultivos',
    loadComponent: () => import('./components/cultivo/cultivo-list/cultivo-list.component').then(m => m.CultivoListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cultivos/nuevo',
    loadComponent: () => import('./components/cultivo/cultivo-form/cultivo-form.component').then(m => m.CultivoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'alertas',
    loadComponent: () => import('./components/alertas/alerta-list/alerta-list.component').then(m => m.AlertaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/auth/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
