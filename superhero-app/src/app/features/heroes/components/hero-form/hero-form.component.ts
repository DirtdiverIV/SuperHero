import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { UppercaseInputDirective } from '../../../../shared/directives/uppercase-input.directive';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    UppercaseInputDirective,
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';

  private fb = inject(FormBuilder);
  private heroStore = inject(HeroStore);
  private router = inject(Router);

  loading = this.heroStore.loading;
  selectedHero = this.heroStore.selectedHero;
  editMode = computed(() => !!this.selectedHero());
  powers: string[] = [];

  heroForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    alterEgo: [''],
    publisher: ['', Validators.required],
    firstAppearance: ['', Validators.required],
    imageUrl: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const hero = this.selectedHero();
      if (hero) {
        this.heroForm.patchValue({
          name: hero.name,
          alterEgo: hero.alterEgo,
          publisher: hero.publisher,
          firstAppearance: this.formatDate(hero.firstAppearance),
          imageUrl: hero.imageUrl,
        });
        this.powers = [...hero.powers];

        if (this.mode === 'view') {
          this.heroForm.disable();
        }
      }
    });
  }

  ngOnInit() {
    if (this.mode === 'view') {
      this.heroForm.disable();
    }
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  addPower(event: MatChipInputEvent): void {
    if (this.mode === 'view') return;

    const value = (event.value || '').trim();
    if (value) {
      this.powers.push(value);
      event.chipInput!.clear();
    }
  }

  removePower(power: string): void {
    if (this.mode === 'view') return;

    const index = this.powers.indexOf(power);
    if (index >= 0) {
      this.powers.splice(index, 1);
    }
  }

  handleImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/placeholder-hero.jpg';
  }

  onSubmit(): void {
    if (this.mode === 'view') return;

    if (this.heroForm.valid) {
      const heroData = {
        ...this.heroForm.value,
        powers: this.powers,
      };

      if (this.editMode()) {
        this.heroStore.updateHero(this.selectedHero()!.id, heroData);
      } else {
        this.heroStore.createHero(heroData);
      }

      this.router.navigate(['/heroes']);
    }
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  getTitle(): string {
    switch (this.mode) {
      case 'view':
        return 'Detalles del Héroe';
      case 'edit':
        return 'Editar Héroe';
      default:
        return 'Crear Héroe';
    }
  }
}
