import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GameService {
	private gameStartedSubject = new BehaviorSubject<boolean>(false);
	private gameOverSubject = new Subject<number>();
	private scoreSubject = new BehaviorSubject<number>(0);
	private triesSubject = new BehaviorSubject<number>(0);

	gameStarted$ = this.gameStartedSubject.asObservable();
	gameOver$ = this.gameOverSubject.asObservable();
	score$ = this.scoreSubject.asObservable();
	tries$ = this.triesSubject.asObservable();

	startGame() {
		this.gameStartedSubject.next(true);
	}

	endGame(finalScore: number = 0) {
		this.gameStartedSubject.next(false);
		this.scoreSubject.next(0);
		this.triesSubject.next(0);
		if (finalScore !== undefined) {
			this.gameOverSubject.next(finalScore);
		}
	}

	setScore(score: number) {
		this.scoreSubject.next(score);
	}

	setTries(tries: number) {
		this.triesSubject.next(tries);
	}
}