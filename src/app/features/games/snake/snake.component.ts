import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Score } from '../../../core/models/score';
import { AlertService } from '../../../core/services/alert.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { GameService } from '../../../core/services/game.service';
import { SessionService } from '../../../core/services/session.service';


const BOARD_SIZE = 21;

const CONTROLS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

const COLORS = {
  FRUIT: '#F55376',
  HEAD: '#F5BC00',
  BODY: '#3C94E9',
  BOARD: '#6C19FF',
};

@Component({
  selector: 'app-snake',
  imports: [CommonModule],
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.scss'
})
export class SnakeComponent {

  private sub!: Subscription;
  newScore!: Score;
  score = 0;

  private interval = 150;
  private tempDirection = CONTROLS.LEFT;
  board: boolean[][] = [];
  fruit = { x: -1, y: -1 };
  snake = {
    direction: CONTROLS.LEFT,
    parts: [] as { x: number, y: number }[]
  };

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private firestoreService: FirestoreService,
    private session: SessionService
  ) { }

  ngOnInit(): void {
    this.newScore = {
      name: this.session.userEmail ?? 'invitado',
      score: 0,
      date: new Date().toLocaleDateString(),
      game: 'viborita'
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
    this.interval = 150;
    this.tempDirection = CONTROLS.LEFT;

    this.setBoard();

    this.snake = {
      direction: CONTROLS.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.snake.parts.push({ x: 8 + i, y: 8 });
    }

    setTimeout(() => {
      this.resetFruit();
      this.updatePositions();
    }, 500);
  }

  private finishGame() {
    if (this.score > 0) {
      this.saveScore();
    }
    this.gameService.endGame(this.score);
  }

  private resetGame() {
    this.score = 0;
    this.setBoard();
    this.snake.parts = [];
    this.fruit = { x: -1, y: -1 };
  }

  private setBoard(): void {
    this.board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }

  setColors(row: number, col: number): string {
    if (this.fruit.x === col && this.fruit.y === row) return COLORS.FRUIT;
    if (this.snake.parts[0]?.x === col && this.snake.parts[0]?.y === row) return COLORS.HEAD;
    if (this.board[row][col]) return COLORS.BODY;
    return COLORS.BOARD;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(e: KeyboardEvent) {
    if (e.keyCode === CONTROLS.LEFT && this.snake.direction !== CONTROLS.RIGHT) {
      this.tempDirection = CONTROLS.LEFT;
    } else if (e.keyCode === CONTROLS.UP && this.snake.direction !== CONTROLS.DOWN) {
      this.tempDirection = CONTROLS.UP;
    } else if (e.keyCode === CONTROLS.RIGHT && this.snake.direction !== CONTROLS.LEFT) {
      this.tempDirection = CONTROLS.RIGHT;
    } else if (e.keyCode === CONTROLS.DOWN && this.snake.direction !== CONTROLS.UP) {
      this.tempDirection = CONTROLS.DOWN;
    }
  }

  private updatePositions(): void {
    const newHead = this.repositionHead();

    if (this.boardCollision(newHead) || this.selfCollision(newHead)) {
      return this.finishGame();
    }

    if (this.fruitCollision(newHead)) {
      this.eatFruit();
    } else {
      const oldTail = this.snake.parts.pop()!;
      this.board[oldTail.y][oldTail.x] = false;
    }

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;
    this.snake.direction = this.tempDirection;

    setTimeout(() => this.updatePositions(), this.interval);
  }

  private repositionHead() {
    const head = { ...this.snake.parts[0] };

    switch (this.tempDirection) {
      case CONTROLS.LEFT: head.x--; break;
      case CONTROLS.RIGHT: head.x++; break;
      case CONTROLS.UP: head.y--; break;
      case CONTROLS.DOWN: head.y++; break;
    }

    return head;
  }

  private boardCollision(part: { x: number, y: number }): boolean {
    return part.x < 0 || part.x >= BOARD_SIZE || part.y < 0 || part.y >= BOARD_SIZE;
  }

  private selfCollision(part: { x: number, y: number }): boolean {
    return this.board[part.y]?.[part.x] === true;
  }

  private fruitCollision(part: { x: number, y: number }): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  private eatFruit(): void {
    this.score++;
    this.snake.parts.push({ ...this.snake.parts[this.snake.parts.length - 1] });
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval = Math.max(50, this.interval - 15);
    }

    this.gameService.setScore(this.score);
  }

  private resetFruit(): void {
    let x = Math.floor(Math.random() * BOARD_SIZE);
    let y = Math.floor(Math.random() * BOARD_SIZE);
    this.fruit = { x, y };
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