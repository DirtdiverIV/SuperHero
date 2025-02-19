// src/app/features/heroes/components/hero-form/hero-form.component.ts
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
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
    UppercaseInputDirective
  ],
  template: `
    <form [formGroup]="heroForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" appUppercaseInput required>
        @if (heroForm.get('name')?.hasError('required') && heroForm.get('name')?.touched) {
          <mat-error>El nombre es requerido</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Identidad Secreta</mat-label>
        <input matInput formControlName="alterEgo">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Editorial</mat-label>
        <input matInput formControlName="publisher" required>
        @if (heroForm.get('publisher')?.hasError('required') && heroForm.get('publisher')?.touched) {
          <mat-error>La editorial es requerida</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Poderes</mat-label>
        <mat-chip-grid #chipGrid aria-label="Poderes del héroe">
          @for (power of powers; track power) {
            <mat-chip-row (removed)="removePower(power)">
              {{power}}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
          }
        </mat-chip-grid>
        <input placeholder="Nuevo poder..."
               [matChipInputFor]="chipGrid"
               (matChipInputTokenEnd)="addPower($event)">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Primera Aparición</mat-label>
        <input matInput type="date" formControlName="firstAppearance" required>
      </mat-form-field>

      <div class="flex gap-4 justify-end">
        <button mat-button type="button" (click)="goBack()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="heroForm.invalid || loading()">
          {{editMode() ? 'Actualizar' : 'Crear'}}
        </button>
      </div>
    </form>
  `
})
export class HeroFormComponent implements OnInit {
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
    firstAppearance: ['', Validators.required]
  });

  constructor() {
    // Efecto para actualizar el formulario cuando se carga el héroe
    effect(() => {
      const hero = this.selectedHero();
      if (hero) {
        this.heroForm.patchValue({
          name: hero.name,
          alterEgo: hero.alterEgo,
          publisher: hero.publisher,
          firstAppearance: this.formatDate(hero.firstAppearance)
        });
        this.powers = [...hero.powers];
      }
    });
  }

  ngOnInit() {
    // Inicialización adicional si es necesaria
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  addPower(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.powers.push(value);
      event.chipInput!.clear();
    }
  }

  removePower(power: string): void {
    const index = this.powers.indexOf(power);
    if (index >= 0) {
      this.powers.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.heroForm.valid) {
      const heroData = {
        ...this.heroForm.value,
        powers: this.powers
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
}