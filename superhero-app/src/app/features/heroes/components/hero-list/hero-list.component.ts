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
    MatCardModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
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
      pageSize: event.pageSize,
    });
  }

  viewHero(id: string) {
    this.router.navigate(['/heroes/view', id]);
  }

  editHero(id: string) {
    this.router.navigate(['/heroes/edit', id]);
  }

  deleteHero(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar héroe',
        message: `¿Estás seguro de que quieres eliminar a ${name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroStore.deleteHero(id);
      }
    });
  }

  trackByHero(index: number, hero: any) {
    return hero.id;
  }
}
