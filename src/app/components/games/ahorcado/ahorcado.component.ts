import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Score } from 'src/app/classes/score';
import { GameScoresService } from 'src/app/services/game-scores.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})


export class AhorcadoComponent implements OnInit {

  newScore: Score;
  score: number = 0;
  gameStarted: boolean = false;
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  tries: number = 5;
  dashes: string[] = [];
  words: string[] = ['neumatico', 'submarino', 'auditores', 'euforia', 'centrifugado', 'murcielago', 'hiperblanduzco', 'esqueleto', 'koala', 'farmaceutico'];
  wordToGuess: string = '';
  pictureNumber: number = 0;


  constructor(private gameScore: GameScoresService, private router: Router) {
    this.newScore = new Score();
    this.newScore.name = localStorage.getItem('token')
    this.newScore.date = new Date().toLocaleDateString();
    this.newScore.game = "Ahorcado";
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

  newGame() {
    this.gameStarted = true;
    this.score = 0;
    this.startGame();
  }

  startGame() {
    this.tries = 5;
    this.pictureNumber = 0;
    this.wordToGuess = this.words[Math.round(Math.random() * (this.words.length - 1))];
    this.dashes = Array(this.wordToGuess.length).fill('_');
    this.gameStarted = true;
  }

  selectLetter(selectedLetter: string) {
    if (this.gameStarted) {

      let flag: boolean = false;

      for (let i = 0; i < this.wordToGuess.length; i++) {
        if (selectedLetter.toLowerCase() == this.wordToGuess[i]) {
          this.dashes[i] = selectedLetter;
          flag = true;
          this.score = this.score + 1;
        }
      }

      if (!flag) {

        this.tries--;

        if (this.tries == 0) {
          this.pictureNumber++;
          this.stopGame();
        } else {
          this.pictureNumber++;
        }
      }
      this.showWinnerMessage();
    }
  }

  showWinnerMessage() {
    var win = true;

    for (const i of this.dashes) {
      if (i == "_") {
        win = false;
      }
    }
    if (win) {
      this.alert('success', '¡Lo salvaste!');
      setTimeout(() => {
        this.saveScore();
      }, 2000);
    }
  }

  stopGame() {
    this.gameStarted = false;
    this.alert('error', 'No pudiste salvarlo ⚰️');
  }

  saveScore() {
    this.newScore.score = this.score;
    this.gameScore.create(this.newScore);
    this.alert('info', 'Guardando puntaje');
  }
}