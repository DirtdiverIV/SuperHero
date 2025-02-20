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
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="hero-title">Galería de Héroes</h1>
            <p class="subtitle">Descubre y gestiona tu colección de superhéroes</p>
          </div>
          <button mat-raised-button color="primary" (click)="createHero()" class="create-button">
            <mat-icon>add</mat-icon>
            Nuevo Héroe
          </button>
        </div>
        <app-hero-search class="search-section" />
      </div>

      <app-hero-list />
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100%;
    }

    .dashboard-header {
      background: linear-gradient(145deg, #1a237e, #0d47a1);
      margin: -1rem -1rem 0;
      padding: 2rem 1rem;
      border-radius: 0 0 24px 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .header-content {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .title-section {
      h1 {
        margin: 0;
        font-size: 2.5rem;
        background: linear-gradient(90deg, #fff, #bbdefb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .subtitle {
        margin: 0.5rem 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
      }
    }

    .create-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.5rem;
      height: 48px;
      font-size: 1rem;
      border-radius: 24px;
      background: linear-gradient(45deg, #f4511e, #ff6d00);
      box-shadow: 0 4px 12px rgba(244, 81, 30, 0.3);
      
      &:hover {
        background: linear-gradient(45deg, #e64a19, #f4511e);
      }
    }

    .search-section {
      max-width: 1280px;
      margin: 2rem auto 0;
      display: block;

      ::ng-deep {
        .mat-mdc-form-field {
          width: 100%;
          
          .mat-mdc-form-field-flex {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .mat-mdc-form-field-outline {
            color: rgba(255, 255, 255, 0.3);
          }
          
          input {
            color: white;
          }
        }
      }
    }
  `]
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