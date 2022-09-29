import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore/';
import { Log } from '../classes/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  pathToCollection = '/logs';
  collectionReference: AngularFirestoreCollection<Log>;
  bdReference: AngularFirestore;

  constructor(private bd: AngularFirestore) {
    this.bdReference = bd;
    this.collectionReference = bd.collection(this.pathToCollection);
  }

  create(log: Log): any {
    return this.collectionReference.add({ ...log });
  }
}
