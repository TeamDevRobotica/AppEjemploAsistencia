import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //apiURL = 'http://localhost:50000/api/';
  //apiURL = "http://192.168.0.6:50000/api/";
  apiURL = 'http://138.117.79.144/api/';
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {

  }

  post(serviceName: string, data: any, options: Object) {
    const url = this.apiURL + serviceName;
    return this.http.post(url, data, options);
  }


  get(tipoABuscar: string, options: Object): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + tipoABuscar, options)
      .pipe(
        tap(Tipo => console.log(tipoABuscar + ' fetched!'))/* ,
        catchError(this.handleError<any[]>('Get student', [])) */
      );
  }



}
