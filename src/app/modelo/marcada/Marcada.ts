import { Identidad } from "../comun/Identidad";
import { Asistencia } from "../asistencia/Asistencia";
import { Institucion } from "../institucion/Institucion";
import { EstadoMarcada } from "./EstadoMarcada";

export class Marcada extends Identidad {

    constructor(hora: string, geolocalizacion: string, estadoMarcada: EstadoMarcada) {
        super();
        this.hora = hora,
        this.geolocalizacion = geolocalizacion
        this.estadoMarcada = estadoMarcada;
    }

    hora: string;

    geolocalizacion: string

    asistencia: Asistencia;

    institucion: Institucion;

    estadoMarcada: EstadoMarcada;


}