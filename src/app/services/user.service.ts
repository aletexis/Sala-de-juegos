import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore/';

import { User } from '../classes/user';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  pathToCollection = '/users';
  collectionReference: AngularFirestoreCollection<User>;
  bdReference: AngularFirestore;

  constructor(private bd: AngularFirestore) {
    this.bdReference = bd;
    this.collectionReference = bd.collection(this.pathToCollection);
  }

  create(user: User): any {
    return this.collectionReference.add({ ...user });
  }

  public getAll() {
    return this.collectionReference;
  }

  public getOne(user: User) {
    return this.bdReference.collection(this.pathToCollection, ref => ref.where("email", "==", user.email).where("password", "==", user.password));
  }
}