// src/app/features/heroes/components/hero-search/hero-search.component.ts
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline" class="custom-form-field">
      <mat-label>Buscar héroe</mat-label>
      <input
        matInput
        [formControl]="searchControl"
        placeholder="Nombre del héroe"
        appUppercaseInput>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
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
          background-color: #1a1a1a !important;
        }

        .mdc-text-field__input {
          caret-color: #2196f3;
        }

        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .mat-mdc-form-field-hint {
          color: rgba(255, 255, 255, 0.6);
        }

        input {
          color: white;
        }

        .mat-mdc-form-field-label {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  `]
})
export class HeroSearchComponent implements OnInit {
  private heroStore = inject(HeroStore);
  private destroyRef = inject(DestroyRef);
  
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.setValue(this.heroStore.searchTerm(), { emitEvent: false });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.heroStore.setSearchTerm(value || '');
      this.heroStore.loadHeroes({ page: 1 });
    });
  }
}