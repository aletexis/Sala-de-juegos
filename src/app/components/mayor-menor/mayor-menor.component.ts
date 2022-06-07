import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Score } from 'src/app/classes/score';
import { GameScoresService } from 'src/app/services/game-scores.service';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})

export class MayorMenorComponent implements OnInit {

  newScore: Score;
  score: number = 0
  gameStarted: boolean = false;
  cardNumber: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15];
  card: number = 0;
  nextCard: number = 0;
  tries: number = 3;


  constructor(private gameScore: GameScoresService) {
    this.newScore = new Score();
    this.newScore.name = localStorage.getItem('token')
    this.newScore.date = new Date().toLocaleDateString();
    this.newScore.game = "Mayor o Menor";
  }

  ngOnInit(): void {
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

  goHome() {
    location.assign("/home")
  }

  logout() {
    localStorage.removeItem('token')
  }

  newGame() {
    this.gameStarted = true;
    this.score = 0;
    this.tries = 3;
    this.startGame();
  }

  startGame() {
    this.gameStarted = true;
    this.card = this.cardNumber[Math.floor(Math.random() * this.cardNumber.length)];
  }

  showNextCard(card: number, option: string) {
    this.nextCard = this.cardNumber[Math.floor(Math.random() * this.cardNumber.length)];

    if (this.nextCard > card) {
      if (option == 'mayor') {
        if (this.tries == 0) {
          this.stopGame();
        }
        this.score = this.score + 1;
      }
    }
    if (this.nextCard < card) {
      if (option == 'menor') {
        if (this.tries == 0) {
          this.stopGame();
        }
        this.score = this.score + 1;
      }
    }
    if (this.nextCard > card) {
      if (option == 'menor') {
        if (this.tries == 0) {
          this.stopGame();
        }
        this.tries = this.tries - 1;
      }
    }
    if (this.nextCard < card) {
      if (option == 'mayor') {
        if (this.tries == 0) {
          this.stopGame();
        }
        this.tries = this.tries - 1;
      }
    }
    if (this.tries == 0) {
      this.stopGame();
    }

    this.card = this.nextCard;
  }

  mayorMenor(option: string) {
    this.showNextCard(this.card, option);
  }

  stopGame() {
    this.gameStarted = false;

    this.alert('error', '¡Ups! Respuesta incorrecta');

    if (this.score != 0) {
      setTimeout(() => {
        this.saveScore();
      }, 2000);
    }
  }

  saveScore() {
    this.newScore.score = this.score;
    this.gameScore.AgregarScore(this.newScore);
    this.alert('info', 'Guardando puntaje');
  }
}