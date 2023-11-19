import { AsyncValidatorFn, AbstractControl, ValidationErrors, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function dateFormatValidatorAsync(): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const value = control.value;

    if (!value) {
      return of(null); // No hay error si el campo está vacío
    }
    console.log('valor fecha:', value);
    // Asegúrate de que el valor esté en el formato correcto (dd-MMM-yyyy)
    const regex = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;

    if (regex.test(value)) {
      return of(null); // Formato válido
    } else {
      console.log('formato invalido fecha:', value);
      return of({ invalidDateFormat: true });
    }
  };
}

export const DATE_FORMAT_ASYNC_VALIDATOR = {
  provide: NG_ASYNC_VALIDATORS,
  useExisting: dateFormatValidatorAsync,
  multi: true,
};
