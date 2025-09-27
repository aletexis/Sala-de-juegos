import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Score } from '../../../core/models/score';
import { AlertService } from '../../../core/services/alert.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SessionService } from '../../../core/services/session.service';
import { GameService } from '../../../core/services/game.service';
import { WordsService } from '../../../core/services/words.service';

@Component({
  selector: 'app-hangman',
  imports: [CommonModule],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.scss'
})
export class HangmanComponent {

  private sub!: Subscription;
  newScore!: Score;
  score = 0;
  tries = 5;

  pictureNumber = 0;
  words: string[] = [];
  remainingWords: string[] = [];
  wordToGuess = '';
  dashes: string[] = [];
  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  usedLetters: string[] = [];

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private firestoreService: FirestoreService,
    private session: SessionService,
    private wordsService: WordsService,
  ) { }

  ngOnInit(): void {
    this.newScore = {
      name: this.session.userEmail ?? 'invitado',
      score: 0,
      date: new Date().toLocaleDateString(),
      game: 'hangman'
    };

    this.sub = this.gameService.gameStarted$.subscribe(started =>
      started ? this.startGame() : this.resetGame()
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private startGame() {
    this.score = 0;
    this.tries = 5;
    this.pictureNumber = 0;
    this.usedLetters = [];
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);

    if (!this.words.length) {
      this.wordsService.getWords('ahorcado').subscribe(words => {
        this.words = words;
        this.remainingWords = [...this.words];
        this.nextWord();
      });
    } else {
      this.remainingWords = [...this.words];
      this.nextWord();
    }
  }

  private finishGame() {
    if (this.score > 0) {
      this.saveScore();
    }
    this.gameService.endGame(this.score);
  }

  private resetGame() {
    this.score = 0;
    this.tries = 5;
    this.pictureNumber = 0;
    this.wordToGuess = '';
    this.dashes = [];
    this.usedLetters = [];
    this.remainingWords = [];
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);
  }

  private nextWord() {
    if (!this.remainingWords.length) {
      this.alertService.success('¡Adivinaste todas las palabras! 🎉');
      this.finishGame();
      return;
    }

    this.wordToGuess = this.remainingWords.splice(
      Math.floor(Math.random() * this.remainingWords.length), 1)[0];

    this.dashes = Array(this.wordToGuess.length).fill('_');
    this.usedLetters = [];
  }

  selectLetter(letter: string) {
    if (this.usedLetters.includes(letter)) return;

    this.usedLetters.push(letter);

    let hit = false;

    this.wordToGuess.split('').forEach((char, i) => {
      if (letter.toLowerCase() === char) {
        this.dashes[i] = letter;
        this.score++;
        hit = true;
      }
    });

    if (hit) {
      this.gameService.setScore(this.score);
    } else {
      this.tries--;
      this.pictureNumber++;
      this.gameService.setTries(this.tries);

      if (this.tries === 0) {
        this.finishGame();
        return;
      }
    }

    if (!this.dashes.includes('_')) {
      this.alertService.success('¡Palabra acertada! 🎉');
      setTimeout(() => this.nextWord(), 800);
    }
  }

  private saveScore() {
    this.newScore.score = this.score;
    this.firestoreService.create('scores', this.newScore)
      .then(() => this.alertService.success('Puntaje guardado'))
      .catch(err => {
        console.error('Error guardando puntaje:', err);
        this.alertService.error('Hubo un problema al guardar el puntaje');
      });
  }
}