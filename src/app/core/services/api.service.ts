import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { vmEstadoCd } from '../../models/api/vmEstadoCd';
import { vmUserAdd } from '../../modules/user/models/vmUserAdd';
const httpOption = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url_api: string = 'https://localhost:44361/api/';
  constructor(private http: HttpClient) {
  }

  getListCiudad(): Observable<vmEstadoCd[]> {
    // Mostrar los datos del usuario en la consola (opcional)
    let url = this.url_api + 'Users/getEstados';
    return this.http.get<vmEstadoCd[]>(url, httpOption).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error); // retrona error a component
      })
    );
  }
  add(model: vmUserAdd): Observable<number> {
    let  url =  this.url_api+'Users/addUser';
    return this.http.post<number>(url,model, httpOption).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error); // retrona error a component
      })
    );    
  }
  
}
