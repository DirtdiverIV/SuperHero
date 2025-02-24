import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HeroService } from './hero.service';
import { environment } from '../../../../environments/environment';
import { Hero } from '../../models/hero.model';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HeroService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockHero: Hero = {
    id: '1',
    name: 'TEST HERO',
    powers: ['TEST POWER'],
    publisher: 'TEST PUBLISHER',
    firstAppearance: new Date('2023-01-01'),
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should get heroes with pagination without name filter', () => {
      const filters = { page: 1, pageSize: 10 };
      const mockResponse = [mockHero];
      const totalCount = '1';

      service.getHeroes(filters).subscribe((response) => {
        expect(response.data).toEqual(mockResponse);
        expect(response.total).toBe(1);
        expect(response.page).toBe(filters.page);
        expect(response.pageSize).toBe(filters.pageSize);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/heroes?_page=1&_limit=10&name_like=`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse, {
        headers: { 'X-Total-Count': totalCount },
      });
    });

    it('should get heroes with pagination and name filter', () => {
      const filters = { page: 1, pageSize: 10, name: 'TEST' };
      const mockResponse = [mockHero];
      const totalCount = '1';

      service.getHeroes(filters).subscribe((response) => {
        expect(response.data).toEqual(mockResponse);
        expect(response.total).toBe(1);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/heroes?_page=1&_limit=10&name_like=TEST`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse, {
        headers: { 'X-Total-Count': totalCount },
      });
    });

    it('should handle empty response body', () => {
      const filters = { page: 1, pageSize: 10 };

      service.getHeroes(filters).subscribe((response) => {
        expect(response.data).toEqual([]);
        expect(response.total).toBe(0);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/heroes?_page=1&_limit=10&name_like=`
      );
      req.flush(null, {
        headers: { 'X-Total-Count': '' },
      });
    });
  });

  it('should search heroes by name', () => {
    const searchTerm = 'TEST';

    service.searchHeroes(searchTerm).subscribe((heroes) => {
      expect(heroes).toEqual([mockHero]);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/heroes?name_like=${searchTerm.toUpperCase()}`
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockHero]);
  });

  it('should get hero by id and convert firstAppearance to Date', () => {
    const heroId = '1';

    const heroResponse = {
      ...mockHero,
      firstAppearance: '2023-01-01T00:00:00.000Z',
    };

    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero.id).toBe(mockHero.id);
      expect(hero.name).toBe(mockHero.name);

      expect(hero.firstAppearance instanceof Date).toBe(true);
      expect(hero.firstAppearance.getFullYear()).toBe(2023);
      expect(hero.firstAppearance.getMonth()).toBe(0);
      expect(hero.firstAppearance.getDate()).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('GET');
    req.flush(heroResponse);
  });

  it('should create a new hero with timestamps', () => {
    const { id, createdAt, updatedAt, ...newHero } = mockHero;

    service.createHero(newHero).subscribe((hero) => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes`);
    expect(req.request.method).toBe('POST');

    expect(req.request.body.createdAt).toBeDefined();
    expect(req.request.body.updatedAt).toBeDefined();

    expect(typeof req.request.body.createdAt).toBe('string');
    expect(typeof req.request.body.updatedAt).toBe('string');

    expect(new Date(req.request.body.createdAt).getTime()).not.toBeNaN();
    expect(new Date(req.request.body.updatedAt).getTime()).not.toBeNaN();

    req.flush(mockHero);
  });

  it('should update a hero with current timestamp', () => {
    const heroId = '1';
    const updateData = { name: 'UPDATED HERO' };

    service.updateHero(heroId, updateData).subscribe((hero) => {
      expect(hero.name).toBe(updateData.name);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('PATCH');

    expect(req.request.body.updatedAt).toBeDefined();

    expect(typeof req.request.body.updatedAt).toBe('string');

    expect(new Date(req.request.body.updatedAt).getTime()).not.toBeNaN();

    req.flush({ ...mockHero, ...updateData });
  });

  it('should delete a hero', () => {
    const heroId = '1';

    service.deleteHero(heroId).subscribe((response) => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
