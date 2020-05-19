import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Institucion } from '../../modelo/institucion/Institucion';
import { HttpService } from 'src/app/servicios/http/http.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { Asistencia } from 'src/app/modelo/asistencia/Asistencia';
import { Marcada } from 'src/app/modelo/marcada/Marcada';
import { DateUtils } from '../../util/DateUtils';
import { Usuario } from 'src/app/modelo/Usuario';
import { EstadoMarcada } from 'src/app/modelo/marcada/EstadoMarcada';
import { GeolocalizacionService } from 'src/app/servicios/geo/geolocalizacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-marcada',
  templateUrl: './marcada.component.html',
  styleUrls: ['./marcada.component.scss'],
})
export class MarcadaComponent implements OnInit {

  instituciones: Institucion[];
  institucion: Institucion;

  asistencia: Asistencia;
  marcada: Marcada;
  usuario: Usuario;
  estadoMarcada: EstadoMarcada;

  entrada;

  constructor(
    private htthService: HttpService,
    private storageService: StorageService,
    private geo: GeolocalizacionService,
    private router: Router
  ) {

  }

  async ngOnInit() {
    this.entrada = await this.storageService.get('isEntrada') == null ? true : await this.storageService.get('isEntrada');
    this.institucion = null;
    await this.storageService.get('userData').then(user => {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': user.token });
      let options = { headers: headers, withCredintials: false };
      this.htthService.get('institucion', options).subscribe(inst => {
        this.instituciones = inst;
      });
    });

  }

  async marcar() {
    this.entrada = false;

    let user = await this.storageService.get('userData');

    await this.crearAsistencia(user.idUsuario, 1);

    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': user.token });
    let options = { headers: headers, withCredintials: false };
    this.htthService.post('asistencia', this.asistencia, options).subscribe(asist => {
      this.storageService.store('isEntrada', false);
      alert('Entrada con exito');
      this.router.navigate(['']);
    });
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.institucion = event.value;
  }


  async marcarSalida() {
    this.entrada = true;
    let user = await this.storageService.get('userData');
    await this.crearAsistencia(user.idUsuario, 2);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': user.token });
    let options = { headers: headers, withCredintials: false };
    this.htthService.post('asistencia', this.asistencia, options).subscribe(asist => {
      this.storageService.store('isEntrada', true);
      alert('Salida con exito');
      this.router.navigate(['']);
    });
  }


  //Crea una asistencia en la fecha actual, asocia una marcada
  //Crea un usuario con el id de usuario de localStorage
  //Crea un EstadoMarcada y lo Asocia a una marcada
  //Se agrega la marcada creada a la coleccion de marcadas de la asistencia
  async crearAsistencia(idUsuario: number, idEstadoMarcada: number): Promise<Asistencia> {
    let geo = await this.geo.getCurrentPosition();
    let fecha = DateUtils.mixedDateToDateString(new Date());
    let hora = DateUtils.mixedDateToTimeString(new Date());
    this.usuario = new Usuario(idUsuario);
    this.asistencia = new Asistencia(fecha, this.usuario);
    this.estadoMarcada = new EstadoMarcada(idEstadoMarcada);
    this.marcada = new Marcada(hora, ' altitude ' + geo.coords.latitude + ' longitude ' + geo.coords.longitude, this.estadoMarcada);
    this.marcada.institucion = this.institucion;
    this.asistencia.marcadas.push(this.marcada);
    return this.asistencia;
  }
}
