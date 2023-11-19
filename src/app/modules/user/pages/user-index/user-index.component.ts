import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { vmEstadoCd } from '../../../../models/api/vmEstadoCd';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';
import { format, isValid, parse } from 'date-fns';
import { DATE_FORMAT_ASYNC_VALIDATOR, dateFormatValidatorAsync } from '../../../components/validators/date-format/date-format.component';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../components/validators/my-date-formats';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MsgModalComponent } from '../../components/msg-modal/msg-modal.component';
import { vmUserAdd } from '../../models/vmUserAdd';
import moment from 'moment';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.scss',
  providers: [
    ApiService,
    DATE_FORMAT_ASYNC_VALIDATOR,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
})
export class UserIndexComponent implements OnInit {
  //   public nombre: string = '';
  //   public  email: string = '';
  //   public  telefono: string = '';
  //  // public  fecha: string = '';
  public fecha: Date | null = null;
  //   public  ciudad: string = '';

  public picker!: MatDatepicker<Date>;
  ufrom!: FormGroup;
  submitted = false;


  selectedCar: number = 0;

  // opcionesCiudad = [
  //   { id: 1, nombre: 'Ciudad A' },
  //   { id: 2, nombre: 'Ciudad B' },
  //   { id: 3, nombre: 'Ciudad C' },
  //   // Agrega más opciones según sea necesario
  // ];
  public lstEstadoCd: vmEstadoCd[] = [];

  filteredOptions!: Observable<any[]>;
  constructor(private readonly _formBuilder: FormBuilder,
    private api: ApiService, private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.ufrom = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(10)]],
      fecha: [null, Validators.required],
      // fecha: [null, {
      //   validators: [Validators.required],
      //   asyncValidators: [dateFormatValidatorAsync()],
      //   updateOn: 'blur',
      // }],
      ciudad: ['', Validators.required]
    });
    this.onLoadInfo();
    const ciudadControl = this.ufrom.get('ciudad');

    if (ciudadControl) {
      this.filteredOptions = ciudadControl.valueChanges.pipe(
        debounceTime(300), // Espera 300 ms después de cada pulsación de tecla
        distinctUntilChanged(), // Solo emite si el valor cambia
        startWith(''),
        map(value => (value.length >= 3 ? this._filter(value) : []))
      );
    }

  }
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.lstEstadoCd.filter(option => option.estado_cd.toLowerCase().includes(filterValue));
  }
  displayFn(option: vmEstadoCd): string {
    return option ? option.estado_cd : '';
  }
  private validateDateFormatAsync(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    const value = control.value;

    // Realiza la validación asíncrona del formato de fecha
    return of(value).pipe(
      map(dateString => {
        if (!dateString || dateString.trim() === '') {
          return null; // No hay error si el campo está vacío
        }
        console.log('Formulario enviadoaa:', dateString);
        const formattedDate = format(new Date(dateString), 'dd-MMM-yyyy');
        // Compara la fecha formateada con la cadena original
        return formattedDate === dateString ? null : { invalidDateFormat: true };
      }),
      catchError(() => of({ invalidDateFormat: true })) // Manejo de errores, devolver un error en caso de fallo
    );
  }

  getFormattedDate(): string {

    const fechaControl = this.ufrom.get('fecha');

    if (fechaControl && fechaControl.value) {

      return format(fechaControl.value, 'dd-MMM-yyyy');
    }

    return '';
  }
  get f() {
    return this.ufrom.controls;
  }
  onLoadInfo() {

    this.api.getListCiudad()
      .subscribe(
        (res) => {
          console.log('Aviso:', res);
          if (res != null) {

            this.lstEstadoCd = res as vmEstadoCd[];

          } else {
            // Manejar errores o mostrar mensajes de error al usuario si el inicio de sesión falla
            //this.toastService.showInfoToast('Aviso', 'Favor de intentarlo de nuevo');
            console.log('Aviso:', 'Favor de intentarlo de nuevo..!');
            //this._router.navigate(['/forgot-password']); // Navegar a la ruta principal si el inicio de sesión es exitoso
          }
        },
        (error) => {
          console.log('Aviso2:', 'Favor de intentarlo de nuevo..!');

          //this.toastService.showErrorToast('Error toast title', 'Favor de intentar de nuevo..!');
        }
      );
  }
  getErrorMessage(errorKey: string, control: AbstractControl): string {

    if (errorKey === 'required') {
      return 'es obligatorio.';
    } else if (errorKey === 'email' && control.hasError('email')) {
      return 'Por favor, ingresa un correo electrónico válido.';
    } else if (errorKey === 'minlength' && control.hasError('minlength')) {
      return `debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    } else if (errorKey === 'min' && control.hasError('min')) {
      return `El valor mínimo permitido es ${control.errors?.['min'].min}.`;
    } else {

      return `Error: ${errorKey}`;
    }
  }
  handleDateChange(event: MatDatepickerInputEvent<Date, unknown>): void {
    this.fecha = event.value || null;
  }
  onShowModalErros(errors: string[]) {


    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = errors;

    const dialogRef = this.dialog.open(MsgModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        //this.onLoadInfo(0);
      }
    );

  }


  enviar() {
    this.submitted = true;

    if (this.ufrom.invalid) {

      const errors = [];
      for (const controlName in this.ufrom.controls) {
        if (this.ufrom.controls[controlName].invalid) {
          const control = this.ufrom.controls[controlName];
          for (const errorKey in control.errors) {
            errors.push(`El campo ${controlName}: ${this.getErrorMessage(errorKey, control)}`);
          }

        }
      }

      // Mostrar la lista de errores (puedes manejarlos de la manera que prefieras, como alertas, mensajes en la interfaz, etc.)
      if (errors.length > 0) {
        // console.log('Errores en el formulario:', errors);
        // alert(errors);
        this.onShowModalErros(errors);

      }
      return;
    }

    const fechaMoment: moment.Moment | null = moment(this.ufrom.get('fecha')?.value);

    // Verifica si la fecha  es válida
    if (fechaMoment.isValid()) {
    

      const oUsr: vmUserAdd = {
        id: 0,
        nombre: this.ufrom.get('nombre')?.value,
        email: this.ufrom.get('email')?.value,
        telefono: this.ufrom.get('telefono')?.value +'',
        fecha: fechaMoment.toDate(),
        ciudadEstadoId: this.ufrom.get('ciudad')?.value.id,
      };
      console.log('datos en el formulario:', oUsr);
      var oresUsu = this.api.add(oUsr)
        .subscribe(
          (res) => {
            console.log('postADD:', res);
            if (res > 0) {
              const arrMsg: string[] = ["Registro Guardado..!"];
              this.onShowModalErros(arrMsg);

            } else {
              const arrMsg: string[] = ["Favor de intentarlo de nuevo..!"];
              this.onShowModalErros(arrMsg);

            }
          },
          (error) => {
            const arrMsg: string[] = ["Favor de intentarlo de nuevo..!", error];
            this.onShowModalErros(arrMsg);
          }
        );

    } else {
      console.log('Fecha no válida');
    }


  }

}
