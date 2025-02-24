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
    HeroSearchComponent,
  ],
  templateUrl: './hero-dashboard.component.html',
  styleUrl: './hero-dashboard.component.scss',
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
