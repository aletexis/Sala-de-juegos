import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore/';
import { Mensaje } from '../classes/mensaje';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'


@Injectable({
  providedIn: 'root'
})
export class ChatSnakeService {

  rutaDeLaColeccion = '/juegoPropio';
  referenciaAlaColeccion: AngularFireList<Mensaje>;

  constructor(private bd: AngularFireDatabase) {
    this.referenciaAlaColeccion = bd.list(this.rutaDeLaColeccion);
  }

  Crear(mensaje: Mensaje): any {
    return this.referenciaAlaColeccion.push(mensaje);
  }

  ObtenerTodos(): AngularFireList<Mensaje> {
    return this.referenciaAlaColeccion;
  }
}