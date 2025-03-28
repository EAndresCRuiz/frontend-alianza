import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.';

      //Manejo de errores específicos basados en el código de estado HTTP
      if (error.error && error.error.validationErrors && Array.isArray(error.error.validationErrors)) {
        errorMessage = 'Errores de validación:\n' + 
          error.error.validationErrors
            .map((err: {field: string, message: string}) => `${err.field}: ${err.message}`)
            .join('\n');
      } 
      else if (error.error && typeof error.error === 'object') {
        errorMessage = Object.entries(error.error)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 400) {
        errorMessage = 'Solicitud inválida. Verifica los datos enviados ' +
        error.message;
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'Recurso no encontrado.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
      }

      snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      });

      return throwError(() => error);
    })
  );
};