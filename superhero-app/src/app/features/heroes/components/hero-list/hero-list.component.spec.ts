// src/app/features/heroes/components/hero-list/hero-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { HeroStore } from '../../../../core/services/state/hero.store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../../../core/models/hero.model';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroStoreMock: jasmine.SpyObj<HeroStore>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let routerMock: jasmine.SpyObj<Router>;

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

  beforeEach(async () => {
    const heroStoreSpy = jasmine.createSpyObj('HeroStore', ['loadHeroes', 'deleteHero'], {
      heroes: signal([mockHero]),
      total: signal(1),
      filters: signal({ page: 0, pageSize: 10 })
    });
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HeroListComponent,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule
      ],
      providers: [
        { provide: HeroStore, useValue: heroStoreSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    heroStoreMock = TestBed.inject(HeroStore) as jasmine.SpyObj<HeroStore>;
    dialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to edit hero', () => {
    component.editHero('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/edit', '1']);
  });

  it('should navigate to view hero', () => {
    component.viewHero('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/view', '1']);
  });

  it('should handle page changes', () => {
    const event = { pageIndex: 1, pageSize: 10, length: 20 };
    component.onPageChange(event);
    expect(heroStoreMock.loadHeroes).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10
    });
  });

  it('should open confirmation dialog when deleting hero', () => {
    dialogMock.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    component.deleteHero('1', 'TEST HERO');

    expect(dialogMock.open).toHaveBeenCalled();
    expect(heroStoreMock.deleteHero).toHaveBeenCalledWith('1');
  });

  it('should not delete hero if dialog is dismissed', () => {
    dialogMock.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    component.deleteHero('1', 'TEST HERO');

    expect(dialogMock.open).toHaveBeenCalled();
    expect(heroStoreMock.deleteHero).not.toHaveBeenCalled();
  });

  it('should track heroes by id', () => {
    const index = 0;
    const hero = mockHero;
    expect(component.trackByHero(index, hero)).toBe(hero.id);
  });
});