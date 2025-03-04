import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { HeroFormComponent } from '../../components/hero-form/hero-form.component';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, HeroFormComponent],
  templateUrl: './hero-detail.component.html',
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private heroStore = inject(HeroStore);

  mode: 'create' | 'edit' | 'view' = 'create';

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    const routeMode = this.route.snapshot.data['mode'];

    if (heroId) {
      this.mode = routeMode || 'edit';
      this.heroStore.loadHeroById(heroId);
    }
  }

  ngOnDestroy() {
    this.heroStore.clearSelectedHero();
  }
}
