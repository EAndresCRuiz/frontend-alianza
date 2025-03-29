import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpClient, provideHttpClient, withInterceptors, HttpHandlerFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Injector, runInInjectionContext } from '@angular/core';

describe('ErrorInterceptor', () => {
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let httpClient: HttpClient;
  let injector: Injector;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideAnimations(),
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    injector = TestBed.inject(Injector);
  });

  it('should handle validation errors correctly', (done) => {
    
    const validationErrorResponse = new HttpErrorResponse({
      error: {
        timestamp: '2025-03-28 15:41:24',
        status: 400,
        error: 'Bad Request',
        message: 'La validación falló',
        path: '',
        validationErrors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'name', message: 'Name is required' }
        ]
      },
      status: 400
    });

    const next: HttpHandlerFn = (req) => throwError(() => validationErrorResponse);

    runInInjectionContext(injector, () => {
      const req = new HttpRequest('GET', '/api/test');
      const result = errorInterceptor(req, next);

      result.subscribe({
        error: (error) => {
          expect(error).toBe(validationErrorResponse);
          expect(snackBarSpy.open).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle generic errors correctly', (done) => {
    const genericError = new HttpErrorResponse({
      error: 'Something went wrong',
      status: 500
    });

    const next: HttpHandlerFn = (req) => throwError(() => genericError);

    runInInjectionContext(injector, () => {
      const req = new HttpRequest('GET', '/api/test');
      const result = errorInterceptor(req, next);

      result.subscribe({
        error: (error) => {
          expect(error).toBe(genericError);
          expect(snackBarSpy.open).toHaveBeenCalled();
          done();
        }
      });
    });
  });
});