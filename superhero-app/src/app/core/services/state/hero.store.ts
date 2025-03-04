import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  providedIn: 'root',
})
export class HeroStore {
  private heroService = inject(HeroService);
  private destroyRef = inject(DestroyRef);

  private state = signal<HeroState>({
    heroes: [],
    selectedHero: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      pageSize: environment.defaultPageSize,
    },
    total: 0,
  });

  heroes = computed(() => this.state().heroes);
  selectedHero = computed(() => this.state().selectedHero);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  filters = computed(() => this.state().filters);
  total = computed(() => this.state().total);

  searchTerm = signal('');

  constructor() {
    effect(() => {
      const term = this.searchTerm();

      if (term === undefined) return;

      this.heroService
        .searchHeroes(term)
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: (heroes) => {
            this.state.update((s) => ({
              ...s,
              heroes,
              total: heroes.length,
            }));
          },
          error: (error) => {
            this.state.update((s) => ({
              ...s,
              error: error.message,
            }));
          },
        });
    });
  }

  loadHeroes(filters?: Partial<HeroFilters>) {
    this.state.update((s) => ({ ...s, loading: true }));
    const currentFilters = this.state().filters;
    const newFilters = {
      ...currentFilters,
      ...filters,
      name: this.searchTerm(),
    };

    this.heroService
      .getHeroes(newFilters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.state.update((s) => ({
            ...s,
            heroes: response.data,
            total: response.total,
            filters: newFilters,
            loading: false,
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message,
          }));
        },
      });
  }

  loadHeroById(id: string) {
    this.state.update((s) => ({ ...s, loading: true }));

    this.heroService
      .getHeroById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (hero) => {
          this.state.update((s) => ({
            ...s,
            selectedHero: hero,
            loading: false,
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message,
          }));
        },
      });
  }

  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) {
    this.state.update((s) => ({ ...s, loading: true }));

    this.heroService
      .createHero(hero)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newHero) => {
          this.state.update((s) => ({
            ...s,
            heroes: [...s.heroes, newHero],
            loading: false,
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message,
          }));
        },
      });
  }

  updateHero(id: string, hero: Partial<Hero>) {
    this.state.update((s) => ({ ...s, loading: true }));

    this.heroService
      .updateHero(id, hero)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedHero) => {
          this.state.update((s) => ({
            ...s,
            heroes: s.heroes.map((h) => (h.id === id ? updatedHero : h)),
            selectedHero: updatedHero,
            loading: false,
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message,
          }));
        },
      });
  }

  deleteHero(id: string) {
    this.state.update((s) => ({ ...s, loading: true }));

    this.heroService
      .deleteHero(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.update((s) => ({
            ...s,
            heroes: s.heroes.filter((h) => h.id !== id),
            loading: false,
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message,
          }));
        },
      });
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  clearSelectedHero(): void {
    this.state.update((s) => ({
      ...s,
      selectedHero: null,
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
        pageSize: environment.defaultPageSize,
      },
      total: 0,
    });
  }
}
