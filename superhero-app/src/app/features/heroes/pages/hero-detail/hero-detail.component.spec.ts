import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HeroStore } from '../../../../core/services/state/hero.store';

describe('HeroDetailComponent - Tests simples', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroStoreSpy: jasmine.SpyObj<HeroStore>;
  let activatedRouteStub: any;

  beforeEach(() => {
    heroStoreSpy = jasmine.createSpyObj('HeroStore', [
      'loadHeroById',
      'clearSelectedHero',
    ]);
  });

  describe('Cuando la ruta contiene id', () => {
    beforeEach(async () => {
      activatedRouteStub = {
        snapshot: {
          paramMap: { get: (key: string) => (key === 'id' ? '123' : null) },
          data: { mode: 'view' },
        },
      };

      await TestBed.configureTestingModule({
        imports: [HeroDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: HeroStore, useValue: heroStoreSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería asignar el mode de la ruta y llamar a loadHeroById', () => {
      expect(component.mode).toBe('view');
      expect(heroStoreSpy.loadHeroById).toHaveBeenCalledWith('123');
    });
  });

  describe('Cuando la ruta NO contiene id', () => {
    beforeEach(async () => {
      activatedRouteStub = {
        snapshot: {
          paramMap: { get: (key: string) => null },
          data: { mode: 'view' },
        },
      };

      await TestBed.configureTestingModule({
        imports: [HeroDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: HeroStore, useValue: heroStoreSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería mantener mode en "create" y NO llamar a loadHeroById', () => {
      expect(component.mode).toBe('create');
      expect(heroStoreSpy.loadHeroById).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(async () => {
      activatedRouteStub = {
        snapshot: {
          paramMap: { get: (key: string) => null },
          data: { mode: 'view' },
        },
      };

      await TestBed.configureTestingModule({
        imports: [HeroDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: HeroStore, useValue: heroStoreSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería llamar a clearSelectedHero en ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(heroStoreSpy.clearSelectedHero).toHaveBeenCalled();
    });
  });
});
