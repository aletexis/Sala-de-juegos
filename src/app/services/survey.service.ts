import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  pathToCollection = '/surveys';
  collectionReference: AngularFirestoreCollection<Survey>;
  bdReference: AngularFirestore;

  constructor(private bd: AngularFirestore) {
    this.bdReference = bd;
    this.collectionReference = bd.collection(this.pathToCollection);
  }

  create(survey: Survey): any {
    return this.collectionReference.add({ ...survey });
  }
}