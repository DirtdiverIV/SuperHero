// src/app/features/heroes/components/hero-search/hero-search.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Buscar héroe</mat-label>
      <input matInput [formControl]="searchControl" placeholder="Nombre del héroe">
    </mat-form-field>
  `
})
export class HeroSearchComponent {
  private heroStore = inject(HeroStore);
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.heroStore.loadHeroes({
        name: value || undefined,
        page: 1 // Reset a la primera página al buscar
      });
    });
  }
}