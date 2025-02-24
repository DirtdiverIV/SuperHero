import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { HeroFormComponent } from './hero-form.component';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Hero } from '../../../../core/models/hero.model';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let heroStore: jasmine.SpyObj<HeroStore>;
  let router: Router;

  const mockHero: Hero = {
    id: '1',
    name: 'TEST HERO',
    powers: ['Super Strength', 'Flight'],
    publisher: 'TEST COMICS',
    firstAppearance: new Date('2023-01-15'),
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const heroStoreSpyObj = jasmine.createSpyObj(
      'HeroStore',
      ['createHero', 'updateHero', 'clearSelectedHero'],
      {
        loading: signal(false),
        selectedHero: signal(null),
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HeroFormComponent,
      ],
      providers: [
        { provide: HeroStore, useValue: heroStoreSpyObj },
        provideRouter([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    heroStore = TestBed.inject(HeroStore) as jasmine.SpyObj<HeroStore>;
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(HeroFormComponent);
      component = fixture.componentInstance;
      component.mode = 'create';
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an empty form', () => {
      expect(component.heroForm.get('name')?.value).toBe('');
      expect(component.heroForm.get('publisher')?.value).toBe('');
      expect(component.heroForm.get('firstAppearance')?.value).toBe('');
      expect(component.heroForm.get('imageUrl')?.value).toBe('');
      expect(component.powers.length).toBe(0);
    });

    it('should get correct title', () => {
      expect(component.getTitle()).toBe('Crear Héroe');
    });

    it('should add power to array', () => {
      const event = {
        value: 'Super Strength',
        chipInput: { clear: jasmine.createSpy('clear') },
      } as unknown as MatChipInputEvent;

      component.addPower(event);

      expect(component.powers).toContain('Super Strength');
      expect(event.chipInput.clear).toHaveBeenCalled();
    });

    it('should not add empty power', () => {
      const initialLength = component.powers.length;
      const event = {
        value: '',
        chipInput: { clear: jasmine.createSpy('clear') },
      } as unknown as MatChipInputEvent;

      component.addPower(event);

      expect(component.powers.length).toBe(initialLength);
    });

    it('should remove power from array', () => {
      component.powers = ['Speed', 'Flight'];

      component.removePower('Speed');

      expect(component.powers).not.toContain('Speed');
      expect(component.powers).toContain('Flight');
    });

    it('should handle image error', () => {
      const imgElement = document.createElement('img');
      const event = { target: imgElement } as unknown as ErrorEvent;

      component.handleImageError(event);

      expect(imgElement.src).toContain('/assets/placeholder-hero.jpg');
    });

    it('should create hero and navigate when form is valid', () => {
      component.heroForm.setValue({
        name: 'NEW HERO',
        alterEgo: 'Secret Identity',
        publisher: 'NEW COMICS',
        firstAppearance: '2023-02-20',
        imageUrl: 'new-hero.jpg',
      });

      component.powers = ['Invisibility', 'Flight'];

      component.onSubmit();

      expect(heroStore.createHero).toHaveBeenCalled();

      const createHeroArg = heroStore.createHero.calls.mostRecent().args[0];
      expect(createHeroArg.name).toBe('NEW HERO');
      expect(createHeroArg.publisher).toBe('NEW COMICS');
      expect(createHeroArg.powers).toEqual(['Invisibility', 'Flight']);

      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should not submit if form is invalid', () => {
      component.heroForm.get('name')?.setValue('');

      component.onSubmit();

      expect(heroStore.createHero).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate back when goBack is called', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      Object.defineProperty(heroStore, 'selectedHero', {
        get: () => signal(mockHero),
      });

      fixture = TestBed.createComponent(HeroFormComponent);
      component = fixture.componentInstance;
      component.mode = 'edit';
      fixture.detectChanges();
    });

    it('should load hero data into form', () => {
      expect(component.heroForm.get('name')?.value).toBe(mockHero.name);
      expect(component.heroForm.get('publisher')?.value).toBe(
        mockHero.publisher
      );
      expect(component.heroForm.get('alterEgo')?.value).toBe(mockHero.alterEgo);
      expect(component.powers).toEqual(mockHero.powers);
    });

    it('should get correct title', () => {
      expect(component.getTitle()).toBe('Editar Héroe');
    });

    it('should update hero when form is submitted', () => {
      component.heroForm.patchValue({
        name: 'UPDATED HERO',
        alterEgo: 'New Identity',
      });

      component.onSubmit();

      expect(heroStore.updateHero).toHaveBeenCalled();

      const updateArgs = heroStore.updateHero.calls.mostRecent().args;
      expect(updateArgs[0]).toBe(mockHero.id);
      expect(updateArgs[1].name).toBe('UPDATED HERO');
      expect(updateArgs[1].alterEgo).toBe('New Identity');

      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });

  describe('View Mode', () => {
    beforeEach(() => {
      Object.defineProperty(heroStore, 'selectedHero', {
        get: () => signal(mockHero),
      });

      fixture = TestBed.createComponent(HeroFormComponent);
      component = fixture.componentInstance;
      component.mode = 'view';
      fixture.detectChanges();
    });

    it('should load hero data and disable form', () => {
      expect(component.heroForm.disabled).toBeTrue();
      expect(component.heroForm.get('name')?.value).toBe(mockHero.name);
    });

    it('should get correct title', () => {
      expect(component.getTitle()).toBe('Detalles del Héroe');
    });

    it('should not allow adding powers', () => {
      const initialPowersLength = component.powers.length;
      const event = {
        value: 'New Power',
        chipInput: { clear: jasmine.createSpy('clear') },
      } as unknown as MatChipInputEvent;

      component.addPower(event);

      expect(component.powers.length).toBe(initialPowersLength);
    });

    it('should not allow removing powers', () => {
      const initialPowers = [...component.powers];

      component.removePower(initialPowers[0]);

      expect(component.powers).toEqual(initialPowers);
    });

    it('should not submit form', () => {
      component.onSubmit();

      expect(heroStore.createHero).not.toHaveBeenCalled();
      expect(heroStore.updateHero).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(HeroFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should format date correctly', () => {
      const dateStr = '2023-01-15T00:00:00.000Z';
      const result = component['formatDate'](dateStr);
      expect(result).toBe('2023-01-15');

      const dateObj = new Date('2023-01-15');
      const resultFromObj = component['formatDate'](dateObj);
      expect(resultFromObj).toBe('2023-01-15');
    });
  });
});
