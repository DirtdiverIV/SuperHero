// src/app/features/heroes/components/hero-list/hero-list.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <table mat-table [dataSource]="heroes()" class="w-full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let hero">{{hero.name}}</td>
      </ng-container>

      <ng-container matColumnDef="publisher">
        <th mat-header-cell *matHeaderCellDef>Editorial</th>
        <td mat-cell *matCellDef="let hero">{{hero.publisher}}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let hero">
          <button mat-icon-button color="primary" (click)="editHero(hero.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteHero(hero.id, hero.name)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator
      [length]="total()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage()"
      [pageSizeOptions]="[5, 10, 25]"
      (page)="onPageChange($event)"
      aria-label="Seleccionar página">
    </mat-paginator>
  `
})
export class HeroListComponent {
  private heroStore = inject(HeroStore);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  heroes = this.heroStore.heroes;
  total = this.heroStore.total;
  
  currentPage = computed(() => this.heroStore.filters().page - 1);
  pageSize = computed(() => this.heroStore.filters().pageSize);

  displayedColumns = ['name', 'publisher', 'actions'];

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