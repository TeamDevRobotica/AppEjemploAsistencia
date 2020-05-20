import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Institucion } from 'src/app/modelo/institucion/Institucion';
import { Observable, from } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  instituciones: Institucion[];
  institucion: Institucion;

  constructor(private httpService: HttpService, private storage: StorageService) {

  }

  getInstituciones(token: string) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = { headers: headers, withCredintials: false };
    return this.httpService.get('institucion', options);

  }

  setInstituciones(instituciones: Institucion[]) {
    this.instituciones = instituciones;
  }
  getPorts(page?: number, size?: number): Institucion[] {
    if (page && size) {
      this.instituciones = this.instituciones.slice((page - 1) * size, ((page - 1) * size) + size);
    }
    return this.instituciones;

  }

  getPortsAsync(page?: number, size?: number, timeout = 1000): Observable<Institucion[]> {
    return new Observable<Institucion[]>(observer => {
      observer.next(this.getPorts(page, size));
      observer.complete();
    }).pipe(delay(timeout));
  }
}
