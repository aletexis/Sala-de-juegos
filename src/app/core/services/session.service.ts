import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private userEmailSubject = new BehaviorSubject<string | null>(
		localStorage.getItem('userEmail')
	);
	userEmail$ = this.userEmailSubject.asObservable();

	get userEmail(): string | null {
		return this.userEmailSubject.value;
	}

	get isLoggedIn(): boolean {
		return !!this.userEmail;
	}

	login(email: string) {
		localStorage.setItem('userEmail', email);
		this.userEmailSubject.next(email);
	}

	logout() {
		localStorage.removeItem('userEmail');
		this.userEmailSubject.next(null);
	}
}