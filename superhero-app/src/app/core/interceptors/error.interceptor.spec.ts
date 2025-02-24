import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: spy }
      ]
    });
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('no debe llamar a show si la petición finaliza antes de 100ms y debe llamar a hide', fakeAsync(() => {
    const req = new HttpRequest('GET', '/test');
    
    const next: HttpHandlerFn = () => of(new HttpResponse({ body: 'response' }));

    let response: any;
    loadingInterceptor(req, next).subscribe(res => response = res);

    
    tick(50);

    expect(loadingServiceSpy.show).not.toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  }));

  it('debe llamar a show si la petición tarda más de 100ms y luego llamar a hide al finalizar', fakeAsync(() => {
    const req = new HttpRequest('GET', '/test');
    
    const next: HttpHandlerFn = () => of(new HttpResponse({ body: 'response' })).pipe(delay(150));

    let response: any;
    loadingInterceptor(req, next).subscribe(res => response = res);

    
    tick(90);
    expect(loadingServiceSpy.show).not.toHaveBeenCalled();
    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();

    
    tick(15);
    expect(loadingServiceSpy.show).toHaveBeenCalled();

    
    tick(50);
    
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  }));
});
