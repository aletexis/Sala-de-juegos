import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Score } from '../../../core/models/score';
import { AlertService } from '../../../core/services/alert.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SessionService } from '../../../core/services/session.service';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-higher-lower',
  imports: [CommonModule],
  templateUrl: './higher-lower.component.html',
  styleUrl: './higher-lower.component.scss'
})
export class HigherLowerComponent {
  @ViewChild('playingCard') playingCard!: ElementRef<HTMLDivElement>;

  private sub!: Subscription;
  newScore!: Score;
  score = 0;
  tries = 3;

  cardNumber: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15];
  card = 0;
  nextCard = 0;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private firestoreService: FirestoreService,
    private session: SessionService,
  ) { }

  ngOnInit(): void {
    this.newScore = {
      name: this.session.userEmail ?? 'invitado',
      score: 0,
      date: new Date().toLocaleDateString(),
      game: 'mayor-menor'
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
    this.tries = 3;
    this.card = this.randomCard();
    this.nextCard = 0;
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);
  }

  private finishGame() {
    if (this.score > 0) {
      this.saveScore();
    }
    this.gameService.endGame(this.score);
  }

  private resetGame() {
    this.score = 0;
    this.tries = 3;
    this.card = 0;
    this.nextCard = 0;
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);
  }

  private randomCard(): number {
    return this.cardNumber[Math.floor(Math.random() * this.cardNumber.length)];
  }

  play(option: 'mayor' | 'menor') {
    this.nextCard = this.randomCard();

    const correct = (option === 'mayor' && this.nextCard > this.card)
      || (option === 'menor' && this.nextCard < this.card);

    if (correct) {
      this.score++;
      this.gameService.setScore(this.score);
    } else {
      this.tries--;
      this.gameService.setTries(this.tries);
    }

    if (this.tries === 0) {
      this.finishGame();
    }

    this.restartFlipAnimation();
    this.card = this.nextCard;
  }

  private restartFlipAnimation() {
    const element = this.playingCard.nativeElement;
    element.classList.remove('animate__flipInY');
    void element.offsetWidth;
    element.classList.add('animate__flipInY');
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