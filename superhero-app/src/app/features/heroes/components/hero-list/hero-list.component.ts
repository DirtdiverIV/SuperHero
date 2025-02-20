// src/app/features/heroes/components/hero-list/hero-list.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="heroes-grid">
      @for (hero of heroes(); track hero.id) {
        <mat-card class="hero-card">
          <mat-card-header>
            <mat-card-title class="hero-title">{{hero.name}}</mat-card-title>
            <mat-card-subtitle>{{hero.publisher}}</mat-card-subtitle>
          </mat-card-header>
          
          <img mat-card-image [src]="'/api/placeholder/300/200'" [alt]="hero.name">
          
          <mat-card-content>
            <p class="powers-list">
              @for (power of hero.powers; track power) {
                <span class="power-chip">{{power}}</span>
              }
            </p>
            @if (hero.alterEgo) {
              <p class="alter-ego">Identidad: {{hero.alterEgo}}</p>
            }
          </mat-card-content>
          
          <mat-card-actions align="end">
            <button mat-icon-button color="primary" (click)="editHero(hero.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteHero(hero.id, hero.name)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>

    <mat-paginator
      class="paginator"
      [length]="total()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage()"
      [pageSizeOptions]="[6, 12, 24]"
      (page)="onPageChange($event)"
      aria-label="Seleccionar página">
    </mat-paginator>
  `,
  styles: [`
    .heroes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    .hero-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
      }
    }

    .powers-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .power-chip {
      background-color: var(--mat-primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .alter-ego {
      font-style: italic;
      margin-top: 0.5rem;
    }

    .paginator {
      margin-top: 1rem;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 1rem;
    }
  `]
})
export class HeroListComponent {
  private heroStore = inject(HeroStore);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  heroes = this.heroStore.heroes;
  total = this.heroStore.total;
  
  currentPage = computed(() => this.heroStore.filters().page - 1);
  pageSize = computed(() => this.heroStore.filters().pageSize);

  onPageChange(event: PageEvent) {
    this.heroStore.loadHeroes({
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }

  editHero(id: string) {
    this.router.navigate(['/heroes', 'edit', id]);
  }

  deleteHero(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar héroe',
        message: `¿Estás seguro de que quieres eliminar a ${name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroStore.deleteHero(id);
      }
    });
  }
}