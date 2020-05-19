import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // token: any;
  // headers = new HttpHeaders({ 'Content-Type': 'application/json'/* , 'auth': 'asdawww' */ });
  // httpHeader = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };
  // options = { headers: this.headers, withCredintials: false };
  //apiURL = 'http://localhost:50000/api/';
  //apiURL = "http://192.168.0.6:50000/api/";
  apiURL = 'http://138.117.79.144/api/';
  constructor(
    private http: HttpClient
  ) {

  }

  post(serviceName: string, data: any, options: Object) {
    console.log('post');
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
