import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/servicios/http/http.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { DateUtils } from 'src/app/util/DateUtils';
import { Marcada } from 'src/app/modelo/marcada/Marcada';

@Component({
  selector: 'app-lista-marcada',
  templateUrl: './lista-marcada.component.html',
  styleUrls: ['./lista-marcada.component.scss'],
})
export class ListaMarcadaComponent implements OnInit {

  marcadas: Marcada[] = [];
  constructor(private httpService: HttpService, private storageService: StorageService) { }

  ngOnInit() {
    this.cargarMarcadas();
  }

  ionViewWillEnter(){
    this.cargarMarcadas();
  }



   async cargarMarcadas() {
     let fecha = DateUtils.mixedDateToDateString(new Date());
     let user = await this.storageService.get('userData');
     let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': user.token });
     let options = { headers: headers, withCredintials: false };
     this.httpService.get('asistenciahoy/' + user.idUsuario + '/' + fecha, options).subscribe(asistencia => {

  //     //Orden de la coleccion por id
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
     });
   }

}
