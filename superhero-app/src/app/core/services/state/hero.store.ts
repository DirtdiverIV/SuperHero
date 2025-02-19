// src/app/core/services/state/hero.store.ts
import { Injectable, computed, signal } from '@angular/core';
import { Hero, HeroFilters } from '../../models/hero.model';
import { HeroService } from '../api/hero.service';

interface HeroState {
  heroes: Hero[];
  selectedHero: Hero | null;
  loading: boolean;
  error: string | null;
  filters: HeroFilters;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HeroStore {
  // Estado inicial
  private state = signal<HeroState>({
    heroes: [],
    selectedHero: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      pageSize: environment.defaultPageSize
    },
    total: 0
  });

  // Selectores
  heroes = computed(() => this.state().heroes);
  selectedHero = computed(() => this.state().selectedHero);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  filters = computed(() => this.state().filters);
  total = computed(() => this.state().total);

  constructor(private heroService: HeroService) {}

  // Acciones
  loadHeroes(filters?: Partial<HeroFilters>) {
    this.state.update(s => ({ ...s, loading: true }));

    const currentFilters = this.state().filters;
    const newFilters = { ...currentFilters, ...filters };

    this.heroService.getHeroes(newFilters).subscribe({
      next: (response) => {
        this.state.update(s => ({
          ...s,
          heroes: response.data,
          total: response.total,
          filters: newFilters,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.message
        }));
      }
    });
  }

  loadHeroById(id: string) {
    this.state.update(s => ({ ...s, loading: true }));

    this.heroService.getHeroById(id).subscribe({
      next: (hero) => {
        this.state.update(s => ({
          ...s,
          selectedHero: hero,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.message
        }));
      }
    });
  }

  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) {
    this.state.update(s => ({ ...s, loading: true }));

    this.heroService.createHero(hero).subscribe({
      next: (newHero) => {
        this.state.update(s => ({
          ...s,
          heroes: [...s.heroes, newHero],
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.message
        }));
      }
    });
  }

  updateHero(id: string, hero: Partial<Hero>) {
    this.state.update(s => ({ ...s, loading: true }));

    this.heroService.updateHero(id, hero).subscribe({
      next: (updatedHero) => {
        this.state.update(s => ({
          ...s,
          heroes: s.heroes.map(h => h.id === id ? updatedHero : h),
          selectedHero: updatedHero,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.message
        }));
      }
    });
  }

  deleteHero(id: string) {
    this.state.update(s => ({ ...s, loading: true }));

    this.heroService.deleteHero(id).subscribe({
      next: () => {
        this.state.update(s => ({
          ...s,
          heroes: s.heroes.filter(h => h.id !== id),
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.message
        }));
      }
    });
  }
}