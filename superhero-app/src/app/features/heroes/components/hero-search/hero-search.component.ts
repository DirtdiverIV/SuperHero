// src/app/features/heroes/components/hero-search/hero-search.component.ts
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Buscar héroe</mat-label>
      <input 
        matInput 
        [formControl]="searchControl" 
        placeholder="Nombre del héroe"
        appUppercaseInput>
    </mat-form-field>
  `
})
export class HeroSearchComponent implements OnInit {
  private heroStore = inject(HeroStore);
  private destroyRef = inject(DestroyRef);
  
  searchControl = new FormControl('');

  ngOnInit() {
    // Inicializar el valor del control con el término de búsqueda actual del store
    this.searchControl.setValue(this.heroStore.searchTerm(), { emitEvent: false });

    // Suscribirse a los cambios del control
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.heroStore.setSearchTerm(value || '');
      // Resetear a la primera página al buscar
      this.heroStore.loadHeroes({ page: 1 });
    });
  }
}