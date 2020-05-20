import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { Marcada } from 'src/app/modelo/marcada/Marcada';
import { AsistenciaService } from 'src/app/servicios/asistencia/asistencia.service';

@Component({
  selector: 'app-lista-marcada',
  templateUrl: './lista-marcada.component.html',
  styleUrls: ['./lista-marcada.component.scss'],
})
export class ListaMarcadaComponent implements OnInit {

  marcadas: Marcada[] = [];
  constructor(private asistenciaService: AsistenciaService, private storageService: StorageService) { }

  ngOnInit() {
    this.cargarMarcadas();
  }

  ionViewWillEnter() {
    this.cargarMarcadas();
  }

  async cargarMarcadas() {
    let user = await this.storageService.get('userData');
    this.asistenciaService.getAsistenciaHoy(user.token, user.idUsuario).subscribe(asistencia => {
      //Orden de la coleccion por id
      this.marcadas = asistencia['marcadas'].sort((n1, n2) => {
        if (n1.id < n2.id) {
          return 1;
        }
        if (n1.id > n2.id) {
          return -1;
        }
        return 0;
      });
      this.marcadas = this.marcadas.slice(0, 5);
    }, error => {
      alert('No se encontraron resultados');
    });
  }

}
