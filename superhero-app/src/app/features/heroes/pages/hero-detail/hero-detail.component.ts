// src/app/features/heroes/pages/hero-detail/hero-detail.component.ts
import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { HeroFormComponent } from '../../components/hero-form/hero-form.component';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, HeroFormComponent],
  template: `
    <div class="p-4">
      <app-hero-form />
    </div>
  `
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private heroStore = inject(HeroStore);
  private destroyRef = inject(DestroyRef);

  isEditMode = false;

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      this.isEditMode = true;
      this.heroStore.loadHeroById(heroId);
    }
  }

  ngOnDestroy() {
    // Limpiar el héroe seleccionado al salir usando el método público
    this.heroStore.clearSelectedHero();
  }
}