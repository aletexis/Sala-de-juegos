import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WordsService {
	constructor(private http: HttpClient) { }

	getWords(game: string): Observable<string[]> {
		return this.http.get<{ [key: string]: string[] }>('/hangman/words.json')
			.pipe(map(data => data[game] || []));
	}
}