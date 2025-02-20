// src/app/features/heroes/components/hero-form/hero-form.component.ts
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    UppercaseInputDirective
  ],
  template: `
    <mat-card class="hero-form-card">
      <mat-card-header>
        <mat-card-title class="hero-title">
          {{editMode() ? 'Editar' : 'Crear'}} Héroe
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="heroForm" (ngSubmit)="onSubmit()" class="hero-form">
          <div class="form-grid">
            <div class="form-col">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput 
                       formControlName="name" 
                       appUppercaseInput 
                       required>
                @if (heroForm.get('name')?.hasError('required') && heroForm.get('name')?.touched) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Identidad Secreta</mat-label>
                <input matInput formControlName="alterEgo">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Editorial</mat-label>
                <input matInput 
                       formControlName="publisher" 
                       required>
                @if (heroForm.get('publisher')?.hasError('required') && heroForm.get('publisher')?.touched) {
                  <mat-error>La editorial es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Primera Aparición</mat-label>
                <input matInput 
                       type="date" 
                       formControlName="firstAppearance" 
                       required>
                @if (heroForm.get('firstAppearance')?.hasError('required') && heroForm.get('firstAppearance')?.touched) {
                  <mat-error>La fecha de primera aparición es requerida</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-col">
              <mat-form-field appearance="outline">
                <mat-label>URL de la imagen</mat-label>
                <input matInput 
                       formControlName="imageUrl" 
                       placeholder="https://ejemplo.com/imagen.jpg" 
                       required>
                @if (heroForm.get('imageUrl')?.hasError('required') && heroForm.get('imageUrl')?.touched) {
                  <mat-error>La imagen es requerida</mat-error>
                }
                <mat-hint>La imagen debe tener un tamaño de 120x220 píxeles</mat-hint>
              </mat-form-field>

              <div class="preview-wrapper">
                <div class="image-preview-container">
                  @if (heroForm.get('imageUrl')?.value) {
                    <img [src]="heroForm.get('imageUrl')?.value" 
                         alt="Preview" 
                         class="image-preview"
                         (error)="handleImageError($event)">
                  } @else {
                    <div class="image-placeholder">
                      <mat-icon>image</mat-icon>
                      <span>120 x 220</span>
                    </div>
                  }
                </div>
              </div>

              <mat-form-field appearance="outline" class="powers-field">
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
            </div>
          </div>

          <div class="form-actions">
            <button mat-button 
                    type="button" 
                    (click)="goBack()"
                    [disabled]="loading()">
              Cancelar
            </button>
            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="heroForm.invalid || loading()">
              <mat-icon>{{editMode() ? 'save' : 'add'}}</mat-icon>
              {{editMode() ? 'Actualizar' : 'Crear'}} Héroe
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .hero-form-card {
      max-width: 1000px;
      margin: 2rem auto;
      background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .hero-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      background: linear-gradient(90deg, #fff, #bbdefb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .form-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      &:last-child {
        display: grid;
        grid-template-rows: auto auto 1fr;
        align-content: start;
      }
    }

    .preview-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }

    .image-preview-container {
      width: 120px;
      height: 220px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #1a1a1a;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #1a1a1a;
    }

    .image-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
      gap: 0.5rem;
      padding: 1rem;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      span {
        font-size: 0.75rem;
        text-align: center;
      }
    }

    .powers-field {
      margin-top: 1rem;
      flex-grow: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 1.5rem;
        height: 48px;
        font-size: 1rem;

        &[color="primary"] {
          background: linear-gradient(45deg, #1976d2, #2196f3);

          &:hover:not(:disabled) {
            background: linear-gradient(45deg, #1565c0, #1976d2);
          }
        }
      }
    }

    :host ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }

      .mat-mdc-chip-set {
        min-height: 48px;
      }

      .mat-mdc-form-field-flex {
        background-color: rgba(255, 255, 255, 0.05);
      }

      .mat-mdc-text-field-wrapper {
        background-color: transparent;
      }

      .mdc-text-field--outlined {
        --mdc-theme-primary: #2196f3;
        --mdc-theme-error: #f44336;
      }

      .mat-mdc-form-field-hint {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  `]
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
    firstAppearance: ['', Validators.required],
    imageUrl: ['', Validators.required]
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
          imageUrl: hero.imageUrl
        });
        this.powers = [...hero.powers];
      }
    });
  }

  ngOnInit() {}

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

  handleImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/placeholder-hero.jpg';
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