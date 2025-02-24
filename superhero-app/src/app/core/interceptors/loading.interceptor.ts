import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loadingService = inject(LoadingService);
  const loadingTimeout = setTimeout(() => loadingService.show(), 100);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(loadingTimeout);
      loadingService.hide();
    })
  );
};
