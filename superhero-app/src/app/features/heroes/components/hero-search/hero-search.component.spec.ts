import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
import { HeroSearchComponent } from './hero-search.component';
import { HeroStore } from '../../../../core/services/state/hero.store';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;
  let heroStoreSpy: jasmine.SpyObj<HeroStore>;

  beforeEach(async () => {
    heroStoreSpy = jasmine.createSpyObj('HeroStore', ['searchTerm', 'setSearchTerm', 'loadHeroes']);
    heroStoreSpy.searchTerm.and.returnValue('Iron Man');

    await TestBed.configureTestingModule({
      imports: [
        HeroSearchComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule 
      ],
      providers: [{ provide: HeroStore, useValue: heroStoreSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar searchControl con el valor de heroStore.searchTerm()', () => {
    expect(component.searchControl.value).toEqual('Iron Man');
  });

  it('debería llamar a heroStore.setSearchTerm y loadHeroes cuando cambia el valor del input', fakeAsync(() => {
    component.searchControl.setValue('Captain America');
    tick(300);
    expect(heroStoreSpy.setSearchTerm).toHaveBeenCalledWith('Captain America');
    expect(heroStoreSpy.loadHeroes).toHaveBeenCalledWith({ page: 1 });
  }));
});
