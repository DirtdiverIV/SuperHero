// src/app/core/services/state/hero.store.ts
import { Injectable, computed, effect, inject, signal, runInInjectionContext, Injector } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero, HeroFilters } from '../../models/hero.model';
import { HeroService } from '../api/hero.service';
import { environment } from '../../../../environments/environment';

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
  private heroService = inject(HeroService);
  private injector = inject(Injector);

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

  // Búsqueda reactiva
  searchTerm = signal('');

  constructor() {
    runInInjectionContext(this.injector, () => {
      // Efecto para búsqueda reactiva
      effect(() => {
        toObservable(this.searchTerm).pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntilDestroyed(),
          switchMap(term => {
            if (!term) {
              return this.heroService.getHeroes(this.state().filters);
            }
            return this.heroService.searchHeroes(term);
          })
        ).subscribe({
          next: (response) => {
            if ('data' in response) {
              this.state.update(s => ({
                ...s,
                heroes: response.data,
                total: response.total
              }));
            } else {
              this.state.update(s => ({
                ...s,
                heroes: response,
                total: response.length
              }));
            }
          },
          error: (error) => {
            this.state.update(s => ({
              ...s,
              error: error.message
            }));
          }
        });
      });
    });
  }

  loadHeroes(filters?: Partial<HeroFilters>) {
    this.state.update(s => ({ ...s, loading: true }));
    const currentFilters = this.state().filters;
    // Incorporamos el término de búsqueda actual en los filtros
    const newFilters = { 
      ...currentFilters, 
      ...filters, 
      name: this.searchTerm() // Agregamos el searchTerm aquí
    };
  
    runInInjectionContext(this.injector, () => {
      this.heroService.getHeroes(newFilters).pipe(
        takeUntilDestroyed()
      ).subscribe({
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
    });
  }

  loadHeroById(id: string) {
    this.state.update(s => ({ ...s, loading: true }));

    runInInjectionContext(this.injector, () => {
      this.heroService.getHeroById(id).pipe(
        takeUntilDestroyed()
      ).subscribe({
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
    });
  }

  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) {
    this.state.update(s => ({ ...s, loading: true }));

    runInInjectionContext(this.injector, () => {
      this.heroService.createHero(hero).pipe(
        takeUntilDestroyed()
      ).subscribe({
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
    });
  }

  updateHero(id: string, hero: Partial<Hero>) {
    this.state.update(s => ({ ...s, loading: true }));

    runInInjectionContext(this.injector, () => {
      this.heroService.updateHero(id, hero).pipe(
        takeUntilDestroyed()
      ).subscribe({
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
    });
  }

  deleteHero(id: string) {
    this.state.update(s => ({ ...s, loading: true }));

    runInInjectionContext(this.injector, () => {
      this.heroService.deleteHero(id).pipe(
        takeUntilDestroyed()
      ).subscribe({
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
    });
  }

  // Métodos de utilidad
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  clearSelectedHero(): void {
    this.state.update(s => ({
      ...s,
      selectedHero: null
    }));
  }

  resetState() {
    this.state.set({
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
  }
}
