import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { Asistencia } from 'src/app/modelo/asistencia/Asistencia';
import { DateUtils } from 'src/app/util/DateUtils';
import { Usuario } from 'src/app/modelo/Usuario';
import { EstadoMarcada } from 'src/app/modelo/marcada/EstadoMarcada';
import { Marcada } from 'src/app/modelo/marcada/Marcada';
import { Institucion } from 'src/app/modelo/institucion/Institucion';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private httpService: HttpService, private storage: StorageService) { }

  postAsistencia(token: string, idUsuario: number, idEstadoMarcada: number, geo: any, institucion: Institucion, observacion: string) {
    let asistencia = this.crearAsistencia(idUsuario, idEstadoMarcada, geo, institucion, observacion);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = { headers: headers, withCredintials: false };
    return this.httpService.post('asistencia', asistencia, options);
  }

  getAsistenciaHoy(token: string, idUsuario: number) {
    let fecha = DateUtils.mixedDateToDateString(new Date());
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = { headers: headers, withCredintials: false };
    return this.httpService.get('asistenciahoy/' + idUsuario + '/' + fecha, options);
  }


  crearAsistencia(idUsuario: number, idEstadoMarcada: number, geo: any, institucion: Institucion, observacion: string): Asistencia {
    let fecha = DateUtils.mixedDateToDateString(new Date());
    let hora = DateUtils.mixedDateToTimeString(new Date());
    let usuario = new Usuario(idUsuario);
    let asistencia = new Asistencia(fecha, usuario);
    let estadoMarcada = new EstadoMarcada(idEstadoMarcada);
    let marcada = new Marcada(hora, geo, estadoMarcada, observacion);
    marcada.institucion = institucion;
    asistencia.marcadas.push(marcada);
    return asistencia;
  }
}
