import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HeroDashboardComponent } from './hero-dashboard.component';
import { HeroStore } from '../../../../core/services/state/hero.store';

/* Stub para HeroListComponent */
@Component({
  selector: 'app-hero-list',
  template: '<div>Hero List Stub</div>'
})
class HeroListStubComponent {}

/* Stub para HeroSearchComponent */
@Component({
  selector: 'app-hero-search',
  template: '<div>Hero Search Stub</div>'
})
class HeroSearchStubComponent {}

describe('HeroDashboardComponent', () => {
  let component: HeroDashboardComponent;
  let fixture: ComponentFixture<HeroDashboardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let heroStoreSpy: jasmine.SpyObj<HeroStore>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    heroStoreSpy = jasmine.createSpyObj('HeroStore', ['loadHeroes']);

    await TestBed.configureTestingModule({
      imports: [
        HeroDashboardComponent,
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HeroStore, useValue: heroStoreSpy },
      ]
    })
    // Reemplazamos los componentes hijos por nuestros stubs
    .overrideComponent(HeroDashboardComponent, {
      set: {
        imports: [HeroListStubComponent, HeroSearchStubComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a heroStore.loadHeroes al inicializarse', () => {
    expect(heroStoreSpy.loadHeroes).toHaveBeenCalled();
  });

  it('debería renderizar el título "Galería de Héroes"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-title')?.textContent).toContain('Galería de Héroes');
  });

  it('debería navegar a "/heroes/create" al llamar a createHero()', () => {
    component.createHero();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/create']);
  });

  it('debería navegar a "/heroes/create" al hacer clic en el botón de crear héroe', () => {
    const button = fixture.debugElement.query(By.css('.create-button'));
    button.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/create']);
  });
});
