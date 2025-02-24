import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from './error.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorService', () => {
  let service: ErrorService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [ErrorService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(ErrorService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side error', () => {
    const errorEvent = new ErrorEvent('Client Error', {
      message: 'Test client error',
    });
    const clientError = new HttpErrorResponse({
      error: errorEvent,
      status: 0,
    });

    service.handleError(clientError);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error: Test client error',
      'Cerrar',
      jasmine.any(Object)
    );
  });

  it('should handle server-side error', () => {
    const serverError = new HttpErrorResponse({
      error: 'Server error',
      status: 500,
      statusText: 'Internal Server Error',
    });

    service.handleError(serverError);

    expect(snackBarSpy.open).toHaveBeenCalled();
    const args = snackBarSpy.open.calls.mostRecent().args;
    expect(args[0]).toContain('500');
    expect(args[1]).toBe('Cerrar');
  });

  it('should use default message when no specific error', () => {
    const genericError = new HttpErrorResponse({});

    service.handleError(genericError);

    expect(snackBarSpy.open).toHaveBeenCalled();

    expect(snackBarSpy.open.calls.mostRecent().args[0]).toContain(
      'Error Code: 0'
    );
  });
});
