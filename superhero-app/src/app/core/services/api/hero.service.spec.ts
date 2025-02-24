import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroService } from './hero.service';
import { environment } from '../../../../environments/environment';
import { Hero } from '../../models/hero.model';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService]
    });

    service = TestBed.inject(HeroService);
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
    firstAppearance: new Date(),
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get heroes with pagination', () => {
    const filters = { page: 1, pageSize: 10 };
    const mockResponse = [mockHero];
    const totalCount = '1';

    service.getHeroes(filters).subscribe(response => {
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
      headers: { 'X-Total-Count': totalCount }
    });
  });

  it('should search heroes by name', () => {
    const searchTerm = 'TEST';
    
    service.searchHeroes(searchTerm).subscribe(heroes => {
      expect(heroes).toEqual([mockHero]);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/heroes?name_like=${searchTerm.toUpperCase()}`
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockHero]);
  });

  it('should get hero by id', () => {
    const heroId = '1';

    service.getHeroById(heroId).subscribe(hero => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
  });

  it('should create a new hero', () => {
    const { id, createdAt, updatedAt, ...newHero } = mockHero;

    service.createHero(newHero).subscribe(hero => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes`);
    expect(req.request.method).toBe('POST');
    req.flush(mockHero);
  });

  it('should update a hero', () => {
    const heroId = '1';
    const updateData = { name: 'UPDATED HERO' };

    service.updateHero(heroId, updateData).subscribe(hero => {
      expect(hero.name).toBe(updateData.name);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...mockHero, ...updateData });
  });

  it('should delete a hero', () => {
    const heroId = '1';

    service.deleteHero(heroId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});