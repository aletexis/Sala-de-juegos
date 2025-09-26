import { inject, Injectable } from '@angular/core';
import {
	Firestore,
	collection,
	addDoc,
	collectionData,
	query,
	where,
	CollectionReference,
	DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	private firestore: Firestore = inject(Firestore);

	constructor() { }

	create<T extends DocumentData>(collectionPath: string, item: T) {
		const colRef = collection(this.firestore, collectionPath);
		return addDoc(colRef, item);
	}

	getAll<T extends DocumentData>(collectionPath: string): Observable<T[]> {
		const colRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
		return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
	}

	getFiltered<T extends DocumentData>(collectionPath: string, field: string, value: any): Observable<T[]> {
		const colRef = collection(this.firestore, collectionPath);
		const q = query(colRef, where(field, '==', value));
		return collectionData(q, { idField: 'id' }) as Observable<T[]>;
	}
}