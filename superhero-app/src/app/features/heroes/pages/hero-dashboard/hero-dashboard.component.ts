// src/app/features/heroes/pages/hero-dashboard/hero-dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { HeroSearchComponent } from '../../components/hero-search/hero-search.component';
import { HeroStore } from '../../../../core/services/state/hero.store';

@Component({
  selector: 'app-hero-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    HeroListComponent,
    HeroSearchComponent
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl">Superhéroes</h1>
        <button mat-raised-button color="primary" (click)="createHero()">
          <mat-icon>add</mat-icon>
          Nuevo Héroe
        </button>
      </div>

      <app-hero-search class="mb-4" />
      <app-hero-list />
    </div>
  `
})
export class HeroDashboardComponent {
  private router = inject(Router);
  private heroStore = inject(HeroStore);

  ngOnInit() {
    this.heroStore.loadHeroes();
  }

  createHero() {
    this.router.navigate(['/heroes/create']);
  }
}
