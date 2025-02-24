import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have loading set to false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true when show is called', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading to false when hide is called', () => {
    service.show();
    expect(service.loading()).toBe(true);

    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should handle multiple calls to show and hide', () => {
    service.show();
    service.show();
    expect(service.loading()).toBe(true);

    service.hide();
    expect(service.loading()).toBe(false);

    service.hide();
    expect(service.loading()).toBe(false);
  });
});
