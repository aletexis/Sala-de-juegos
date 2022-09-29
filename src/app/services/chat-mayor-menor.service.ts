import { Injectable } from '@angular/core';
import { Message } from '../classes/message';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore/';


@Injectable({
  providedIn: 'root'
})
export class ChatMayorMenorService {

  pathToCollection = '/chatMayorMenor';
  collectionReference: AngularFirestoreCollection<Message>;
  bdReference: AngularFirestore;

  constructor(private bd: AngularFirestore) {
    this.bdReference = bd;
    this.collectionReference = bd.collection(this.pathToCollection);
  }

  create(message: Message): any {
    return this.collectionReference.add({ ...message });
  }

  getAll() {
    return this.collectionReference;
  }
}