// src/app/features/heroes/components/hero-form/hero-form.component.ts
import { Component, OnInit, computed, effect, inject, Input } from '@angular/core';
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
        <mat-card-title class="form-title">
          {{getTitle()}}
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div [formGroup]="heroForm" class="hero-form">
          <div class="form-grid">
            <div class="form-col">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Nombre</mat-label>
                <input matInput 
                      formControlName="name" 
                      [attr.readonly]="mode === 'view'"
                      required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Identidad Secreta</mat-label>
                <input matInput 
                      formControlName="alterEgo"
                      [attr.readonly]="mode === 'view'">
              </mat-form-field>

              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Editorial</mat-label>
                <input matInput 
                      formControlName="publisher" 
                      [attr.readonly]="mode === 'view'"
                      required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Primera Aparición</mat-label>
                <input matInput 
                      type="date" 
                      formControlName="firstAppearance" 
                      [attr.readonly]="mode === 'view'"
                      required>
              </mat-form-field>
            </div>

            <div class="form-col">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>URL de la imagen</mat-label>
                <input matInput 
                      formControlName="imageUrl" 
                      [attr.readonly]="mode === 'view'"
                      required>
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

              <div class="powers-section">
                <h3>Poderes</h3>
                @if (mode === 'view') {
                  <div class="powers-list">
                    @for (power of powers; track power) {
                      <span class="power-chip">{{power}}</span>
                    }
                  </div>
                } @else {
                  <mat-form-field appearance="outline" class="custom-form-field">
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
                }
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button mat-button 
                    type="button" 
                    (click)="goBack()"
                    [disabled]="loading()">
              {{ mode === 'view' ? 'Volver' : 'Cancelar' }}
            </button>
            @if (mode !== 'view') {
              <button mat-raised-button 
                      color="primary" 
                      (click)="onSubmit()"
                      [disabled]="heroForm.invalid || loading()">
                <mat-icon>{{editMode() ? 'save' : 'add'}}</mat-icon>
                {{editMode() ? 'Actualizar' : 'Crear'}} Héroe
              </button>
            }
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .hero-form-card {
      max-width: 1000px;
      margin: 2rem auto;
      background: #1a1a1a;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-title {
      font-family: 'Bangers', cursive;
      font-size: 24px;
      color: #ffffff;
      letter-spacing: 0.05em;
      margin-bottom: 32px;
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
    }

    .powers-section {
      margin-top: 1rem;
    }

    .powers-section h3 {
      margin: 0 0 1rem;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
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
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    :host ::ng-deep {
      .custom-form-field {
        width: 100%;

        .mat-mdc-form-field-flex {
          background-color: #1a1a1a !important;
        }

        .mdc-text-field--outlined {
          --mdc-theme-primary: #2196f3;
          --mdc-theme-error: #f44336;
        }

        input {
          color: white;
        }

        &.mat-mdc-form-field-disabled {
          .mat-mdc-form-field-flex {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
        }
      }
    }
  `]
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