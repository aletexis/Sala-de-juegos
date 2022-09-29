import { Score } from 'src/app/classes/score';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameScoresService {

  pathToCollection = "/scores";
  collectionReference: AngularFirestoreCollection<Score>;
  sortedReference: AngularFirestoreCollection<Score>;

  scores:Observable<Score[]>;

  constructor(private bd: AngularFirestore) {
    this.collectionReference = bd.collection(this.pathToCollection);
    this.sortedReference = bd.collection<Score>('scores', ref => ref.orderBy('score', 'desc'));
    this.scores = this.collectionReference .valueChanges(this.pathToCollection)
  }

  // getO(){
  //   return this.scores;
  // }

  create(score: Score): any {
    return this.collectionReference.add({ ...score });
  }

  // getAll(): AngularFirestoreCollection<Score> {
  //   return this.sortedReference;
  // }
}