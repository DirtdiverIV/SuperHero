// src/app/core/services/state/hero.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { HeroStore } from './hero.store';
import { HeroService } from '../api/hero.service';
import { of } from 'rxjs';
import { Hero } from '../../models/hero.model';

describe('HeroStore', () => {
  let store: HeroStore;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;

  const mockHero: Hero = {
    id: '1',
    name: 'TEST HERO',
    powers: ['TEST POWER'],
    publisher: 'TEST PUBLISHER',
    firstAppearance: new Date(),
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HeroService', [
      'getHeroes',
      'getHeroById',
      'searchHeroes',
      'createHero',
      'updateHero',
      'deleteHero'
    ]);
    TestBed.configureTestingModule({
      providers: [
        HeroStore,
        { provide: HeroService, useValue: spy }
      ]
    });

    store = TestBed.inject(HeroStore);
    heroServiceSpy = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load heroes', () => {
    heroServiceSpy.getHeroes.and.returnValue(of({
      data: [mockHero],
      total: 1,
      page: 1,
      pageSize: 10
    }));

    store.loadHeroes();

    expect(store.heroes()).toEqual([mockHero]);
    expect(store.total()).toBe(1);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load hero by id', () => {
    heroServiceSpy.getHeroById.and.returnValue(of(mockHero));

    store.loadHeroById('1');

    expect(store.selectedHero()).toEqual(mockHero);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should create hero', () => {
    const { id, createdAt, updatedAt, ...newHero } = mockHero;
    heroServiceSpy.createHero.and.returnValue(of(mockHero));

    store.createHero(newHero);

    expect(store.heroes()).toContain(mockHero);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should update hero', () => {
    const updatedHero = { ...mockHero, name: 'UPDATED HERO' };
    heroServiceSpy.updateHero.and.returnValue(of(updatedHero));

    // Primero cargamos los héroes
    heroServiceSpy.getHeroes.and.returnValue(of({
      data: [mockHero],
      total: 1,
      page: 1,
      pageSize: 10
    }));
    store.loadHeroes();

    // Luego actualizamos
    store.updateHero('1', { name: 'UPDATED HERO' });

    expect(store.heroes().find(h => h.id === '1')?.name).toBe('UPDATED HERO');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should delete hero', () => {
    heroServiceSpy.deleteHero.and.returnValue(of(void 0));
    
    // Primero cargamos los héroes
    heroServiceSpy.getHeroes.and.returnValue(of({
      data: [mockHero],
      total: 1,
      page: 1,
      pageSize: 10
    }));
    store.loadHeroes();

    // Luego eliminamos
    store.deleteHero('1');

    expect(store.heroes().length).toBe(0);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle search term changes', () => {
    const searchTerm = 'TEST';
    heroServiceSpy.searchHeroes.and.returnValue(of([mockHero]));

    store.setSearchTerm(searchTerm);

    expect(store.searchTerm()).toBe(searchTerm);
  });

  it('should reset state', () => {
    store.resetState();

    expect(store.heroes()).toEqual([]);
    expect(store.selectedHero()).toBeNull();
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.filters().page).toBe(1);
  });
});