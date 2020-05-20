import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpService: HttpService) { }

  getUsuarioPorId(token: string, idUsuario: number) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = { headers: headers, withCredintials: false };
    return this.httpService.get('usuarios/' + idUsuario, options);
  }
}
