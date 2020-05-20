import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Institucion } from '../../modelo/institucion/Institucion';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { GeolocalizacionService } from 'src/app/servicios/geo/geolocalizacion.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { InstitucionService } from 'src/app/servicios/institucion/institucion.service';
import { AsistenciaService } from 'src/app/servicios/asistencia/asistencia.service';


@Component({
  selector: 'app-marcada',
  templateUrl: './marcada.component.html',
  styleUrls: ['./marcada.component.scss'],
})
export class MarcadaComponent implements OnInit {

  instituciones: Institucion[];
  institucion: Institucion;

  entrada: any;
  observacion: any;

  portsSubscription: Subscription;

  constructor(

    private storageService: StorageService,
    private geo: GeolocalizacionService,
    private router: Router,
    public loading: LoadingController,
    private institucionService: InstitucionService,
    private asistenciaService: AsistenciaService
  ) {

  }

  getGroupText(port: Institucion, portIndex: number, ports: Institucion[]) {
    if (portIndex === 0 || port.id !== ports[portIndex - 1].id) {
      return port.nombre + ' - ' + port.siglas;
    }

    return null;
  }

  filterPorts(ports: Institucion[], text: string) {
    return ports.filter(port => {
      return port.nombre.toLowerCase().indexOf(text) !== -1 ||
        port.cue.toLowerCase().indexOf(text) !== -1 ||
        port.siglas.toLowerCase().indexOf(text) !== -1;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.portsSubscription) {
        this.portsSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.portsSubscription = this.institucionService.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(ports, text);
      event.component.endSearch();
    });
  }


  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.institucion = event.value;
  }

  async ngOnInit() {
    //Se obtiene el valor de entrada(localStorage) false o true, si es null lo define como true(entrada)
    this.entrada = await this.storageService.get('isEntrada') == null ? true : await this.storageService.get('isEntrada');
    this.institucion = null;
    //Se obtienen de localStorage los datos del usuario, rol,nombre,token
    let user = await this.storageService.get('userData');
    this.institucionService.getInstituciones(user.token).subscribe(inst => {
      this.instituciones = inst;
      this.institucionService.setInstituciones(inst);
    });
  }

  //Marcada de entrada
  async marcar() {
    console.log(this.observacion);
    this.entrada = false;
    let user = await this.storageService.get('userData');
    let geo = await this.devolverPosicion();
    //Se llama al servicio de asistencia para persistirla
    this.asistenciaService.postAsistencia(user.token, user.idUsuario, 1, geo, this.institucion, this.observacion).subscribe(() => {
      //Se asigna false el valor 'isEntrada' de localStorage
      this.observacion = "";
      this.storageService.store('isEntrada', false);
      alert('Entrada con exito');
    });
  }

  //Marcada de Salida
  async marcarSalida() {
    console.log(this.observacion);
    this.entrada = true;
    let user = await this.storageService.get('userData');
    let geo = await this.devolverPosicion();
    this.asistenciaService.postAsistencia(user.token, user.idUsuario, 2, geo, this.institucion, this.observacion).subscribe(() => {
      this.storageService.store('isEntrada', true);
      this.observacion = "";
      alert('Salida con exito');
      this.router.navigate(['']);
    });
  }


  //Devuelve la geolocalizacion
  async devolverPosicion() {
    return this.displayLoader().then(async (loader) => {
      return this.geo.getCurrentPosition().then(position => {
        loader.dismiss();
        return 'lat ' + position.coords.latitude + ' long ' + position.coords.longitude;
      }).catch(err => {
        loader.dismiss();
        return null;
      });
    });
  }

  //Muestra un mensaje de carga...
  async displayLoader() {
    const loading = await this.loading.create({
      message: 'Cargando...',
    });
    await loading.present();
    return loading;
  }
}
