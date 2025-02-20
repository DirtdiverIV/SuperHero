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
    <ng-container *ngFor="let hero of heroes(); trackBy: trackByHero">
      <mat-card class="hero-card">
        <div class="hero-card-container">
          <!-- Sección de la imagen -->
          <div class="hero-image-container">
            <img [src]="hero.imageUrl || '/assets/placeholder-hero.jpg'" [alt]="hero.name" class="hero-image">
          </div>
          <!-- Sección de detalles -->
          <div class="hero-details">
            <div class="hero-header">
              <h2 class="hero-title">{{hero.name}}</h2>
              <p class="hero-publisher">{{hero.publisher}}</p>
              <div *ngIf="hero.alterEgo" class="alter-ego">
                <mat-icon>face</mat-icon>
                <span>{{hero.alterEgo}}</span>
              </div>
            </div>
            <div class="powers-section">
              <h3>Poderes</h3>
              <div class="powers-list">
                <span *ngFor="let power of hero.powers" class="power-chip">{{power}}</span>
              </div>
            </div>
          </div>
        </div>
        <mat-card-actions>
          <button mat-icon-button color="primary" (click)="editHero(hero.id)" matTooltip="Editar héroe">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteHero(hero.id, hero.name)" matTooltip="Eliminar héroe">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </ng-container>
  </div>

  <mat-paginator
    class="custom-paginator"
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
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      padding: 2rem 0;
    }

    .hero-card {
      display: flex;
      flex-direction: column;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
    }

    .hero-card-container {
      display: flex;
      flex-direction: row;
    }

    .hero-image-container {
      width: 120px;
      height: 220px;
      flex-shrink: 0;
      overflow: hidden;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #1a1a1a;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-details {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }

    .hero-header {
      margin-bottom: 1rem;
    }

    .hero-title {
      margin: 0;
      font-size: 1.5rem;
      font-family: 'Bangers', cursive;
      letter-spacing: 0.05em;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-publisher {
      margin: 0.25rem 0 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
    }

    .alter-ego {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
    }

    .alter-ego mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .powers-section {
      margin-top: auto;
    }

    .powers-section h3 {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .powers-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .power-chip {
      background: linear-gradient(45deg, #1976d2, #2196f3);
      color: white;
      border-radius: 16px;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(0, 0, 0, 0.2);
    }

    .custom-paginator {
      margin-top: 2rem;
      background: transparent;
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

  trackByHero(index: number, hero: any) {
    return hero.id;
  }
}