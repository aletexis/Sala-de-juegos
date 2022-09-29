import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Score } from 'src/app/classes/score';
import { GameScoresService } from 'src/app/services/game-scores.service';
import { BestScoreManager } from './app.storage.service';
import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './app.constants';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Component({
  selector: 'app-viborita',
  templateUrl: './viborita.component.html',
  styleUrls: ['./viborita.component.css'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})

export class ViboritaComponent {

  private interval: number;
  private tempDirection: number;
  private default_mode = 'classic';
  private isGameOver = false;

  public all_modes = GAME_MODES;
  public getKeys = Object.keys;
  public board = [];
  public obstacles = [];
  public score = 0;
  public showMenuChecker = false;
  public gameStarted = false;
  public newBestScore = false;
  public best_score = this.bestScoreService.retrieve();

  newScore: Score


  constructor(
    private bestScoreService: BestScoreManager, private gamesrc: GameScoresService, private router: Router
  ) {
    this.setBoard();

    this.newScore = new Score();

    this.newScore.name = localStorage.getItem('token')
    this.newScore.date = new Date().toLocaleDateString();
    this.newScore.game = "Snake";
  }

  alert(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: text
    })
  }

  goTo(place: string) {
    switch (place) {
      case "home":
        this.router.navigateByUrl("home");
        break;

      case "login":
        localStorage.removeItem('token');
        this.router.navigateByUrl("login");
        break;
    }
  }

  showMenu(): void {
    this.showMenuChecker = !this.showMenuChecker;
  }

  newGame() {
    this.gameStarted = true;
    this.default_mode = 'classic';
    this.showMenuChecker = false;
    this.newBestScore = false;
    this.score = 0;
    this.tempDirection = CONTROLS.LEFT;
    this.isGameOver = false;
    this.interval = 150;

    this.snake = {
      direction: CONTROLS.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.snake.parts.push({ x: 8 + i, y: 8 });
    } 

    setTimeout(() => {
      this.startGame();
    }, 2000);
  }

  startGame(): void {
    this.resetFruit();
    this.updatePositions();
  }

  private snake = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    x: -1,
    y: -1
  };

  setBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
  }

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

  setColors(col: number, row: number): string {
    if (this.isGameOver) {
      return COLORS.GAME_OVER;
    } else if (this.fruit.x === row && this.fruit.y === col) {
      return COLORS.FRUIT;
    } else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
      return COLORS.HEAD;
    } else if (this.board[col][row] === true) {
      return COLORS.BODY;
    }

    return COLORS.BOARD;
  };

  updatePositions(): void {
    let newHead = this.repositionHead();
    let me = this;

    if (this.default_mode === 'classic' && this.boardCollision(newHead)) {
      return this.gameOver();
    }

    if (this.selfCollision(newHead)) {
      return this.gameOver();
    } else if (this.fruitCollision(newHead)) {
      this.eatFruit();
    }

    let oldTail = this.snake.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let newHead = Object.assign({}, this.snake.parts[0]);

    if (this.tempDirection === CONTROLS.LEFT) {
      newHead.x -= 1;
    } else if (this.tempDirection === CONTROLS.RIGHT) {
      newHead.x += 1;
    } else if (this.tempDirection === CONTROLS.UP) {
      newHead.y -= 1;
    } else if (this.tempDirection === CONTROLS.DOWN) {
      newHead.y += 1;
    }

    return newHead;
  }

  noWallsTransition(part: any): void {
    if (part.x === BOARD_SIZE) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_SIZE - 1;
    }

    if (part.y === BOARD_SIZE) {
      part.y = 0;
    } else if (part.y === -1) {
      part.y = BOARD_SIZE - 1;
    }
  }

  boardCollision(part: any): boolean {
    return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
  }

  selfCollision(part: any): boolean {
    return this.board[part.y][part.x] === true;
  }

  fruitCollision(part: any): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  resetFruit(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    this.fruit = {
      x: x,
      y: y
    };
  }

  eatFruit(): void {
    this.score++;

    let tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

    this.snake.parts.push(tail);
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval -= 15;
    }
  }

  gameOver(): void {

    let me = this;

    if (this.score > this.best_score) {
      this.bestScoreService.store(this.score);
      this.best_score = this.score;
      this.newBestScore = true;

      this.newScore.score = this.score;
    }

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);
    this.newScore.score = this.score;
    this.setBoard();

    this.alert('error', 'La viborita chocó');

    if (this.score != 0) {
      setTimeout(() => {
        this.saveScore();
      }, 2000);
    }

    setTimeout(() => {
      this.gameStarted = false;
      this.isGameOver = true;
    }, 2000);

  }

  saveScore() {
    this.newScore.score = this.score
    if (this.score != 0) {

      this.gamesrc.create(this.newScore);

      this.alert('info', 'Guardando puntaje');
    }
  }
}