// src/app/features/heroes/heroes-routes.ts
import { Routes } from '@angular/router';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hero-dashboard/hero-dashboard.component')
                        .then(m => m.HeroDashboardComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/hero-detail/hero-detail.component')
                        .then(m => m.HeroDetailComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/hero-detail/hero-detail.component')
                        .then(m => m.HeroDetailComponent),
    data: { mode: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./pages/hero-detail/hero-detail.component')
                        .then(m => m.HeroDetailComponent),
    data: { mode: 'view' }
  }
];