import { Score } from 'src/app/classes/score';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameScoresService {


  rutaDeLaColeccion = "/scores";
  referenciaAlaColeccion: AngularFirestoreCollection<Score>;
  referenciaOrdenada: AngularFirestoreCollection<Score>;

  scores:Observable<Score[]>;

  constructor(private bd: AngularFirestore) {
    this.referenciaAlaColeccion = bd.collection(this.rutaDeLaColeccion);
    this.referenciaOrdenada = bd.collection<Score>('scores', ref => ref.orderBy('score', 'desc'));


    this.scores = this.referenciaAlaColeccion .valueChanges(this.rutaDeLaColeccion)

  }


  getO(){
    return this.scores;
  }

  AgregarScore(score: Score): any {
    return this.referenciaAlaColeccion.add({ ...score });
  }

  GetAll(): AngularFirestoreCollection<Score> {
    return this.referenciaOrdenada;
  }
}