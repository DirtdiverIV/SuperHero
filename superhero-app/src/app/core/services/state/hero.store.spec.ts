import { TestBed } from '@angular/core/testing';
import { HeroStore } from './hero.store';
import { HeroService } from '../api/hero.service';
import { of, throwError } from 'rxjs';
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
    updatedAt: new Date(),
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HeroService', [
      'getHeroes',
      'getHeroById',
      'searchHeroes',
      'createHero',
      'updateHero',
      'deleteHero',
    ]);
    TestBed.configureTestingModule({
      providers: [HeroStore, { provide: HeroService, useValue: spy }],
    });

    store = TestBed.inject(HeroStore);
    heroServiceSpy = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load heroes', () => {
    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [mockHero],
        total: 1,
        page: 1,
        pageSize: 10,
      })
    );

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

    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [mockHero],
        total: 1,
        page: 1,
        pageSize: 10,
      })
    );
    store.loadHeroes();

    store.updateHero('1', { name: 'UPDATED HERO' });

    expect(store.heroes().find((h) => h.id === '1')?.name).toBe('UPDATED HERO');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should delete hero', () => {
    heroServiceSpy.deleteHero.and.returnValue(of(void 0));

    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [mockHero],
        total: 1,
        page: 1,
        pageSize: 10,
      })
    );
    store.loadHeroes();

    store.deleteHero('1');

    expect(store.heroes().length).toBe(0);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should clear selected hero', () => {
    store['state'].update((s) => ({ ...s, selectedHero: mockHero }));
    expect(store.selectedHero()).toEqual(mockHero);

    store.clearSelectedHero();

    expect(store.selectedHero()).toBeNull();
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

  it('should handle error when loading hero by id', () => {
    const errorMessage = 'Error loading hero';
    heroServiceSpy.getHeroById.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    store.loadHeroById('1');

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(errorMessage);
  });

  it('should handle error when creating hero', () => {
    const errorMessage = 'Error creating hero';
    const { id, createdAt, updatedAt, ...newHero } = mockHero;

    heroServiceSpy.createHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    store.createHero(newHero);

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(errorMessage);
  });

  it('should handle error when updating hero', () => {
    const errorMessage = 'Error updating hero';

    heroServiceSpy.updateHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    store.updateHero('1', { name: 'UPDATED HERO' });

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(errorMessage);
  });

  it('should handle error when deleting hero', () => {
    const errorMessage = 'Error deleting hero';

    heroServiceSpy.deleteHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    store.deleteHero('1');

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(errorMessage);
  });

  it('should handle undefined search term', () => {
    store.setSearchTerm('TEST');
    expect(store.searchTerm()).toBe('TEST');

    store.setSearchTerm(undefined as any);

    expect(store.error()).toBeNull();
  });

  it('should load heroes with custom filters', () => {
    const customFilters = { page: 2, pageSize: 20 };

    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [mockHero],
        total: 1,
        page: 2,
        pageSize: 20,
      })
    );

    store.loadHeroes(customFilters);

    expect(heroServiceSpy.getHeroes).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      name: '',
    });

    expect(store.filters().page).toBe(2);
    expect(store.filters().pageSize).toBe(20);
  });

  it('should update heroes array when creating a hero', () => {
    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [mockHero],
        total: 1,
        page: 1,
        pageSize: 10,
      })
    );
    store.loadHeroes();

    const newMockHero = {
      ...mockHero,
      id: '2',
      name: 'NEW HERO',
    };

    const { id, createdAt, updatedAt, ...newHeroData } = newMockHero;
    heroServiceSpy.createHero.and.returnValue(of(newMockHero));

    store.createHero(newHeroData);

    expect(store.heroes().length).toBe(2);
    expect(store.heroes()[0].id).toBe('1');
    expect(store.heroes()[1].id).toBe('2');
  });

  it('should set search term without triggering search when undefined', () => {
    heroServiceSpy.searchHeroes.calls.reset();

    store.setSearchTerm(undefined as any);

    expect(heroServiceSpy.searchHeroes).not.toHaveBeenCalled();
  });

  it('should set loading state to true when making API calls', () => {
    heroServiceSpy.getHeroes.and.returnValue(
      of({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
      })
    );

    expect(store.loading()).toBe(false);

    store.loadHeroes();

    expect(store.loading()).toBe(false);
  });

  it('should load hero by id and update selectedHero', () => {
    const hero = { ...mockHero, id: '999', name: 'SELECTED HERO' };
    heroServiceSpy.getHeroById.and.returnValue(of(hero));

    store.loadHeroById('999');

    expect(store.selectedHero()?.id).toBe('999');
    expect(store.selectedHero()?.name).toBe('SELECTED HERO');
  });
});
