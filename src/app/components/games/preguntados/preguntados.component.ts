import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Score } from 'src/app/classes/score';
import { GameScoresService } from 'src/app/services/game-scores.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})

export class PreguntadosComponent {

  newScore: Score;
  score: number = 0;
  gameStarted: boolean = false;
  allCountriesApi: any = [];
  chosenCountry: any;
  countryOptions: any = [];

  constructor(private gameScore: GameScoresService, private router: Router, private apiCountries: ApiService) {
    this.newScore = new Score();
    this.newScore.name = localStorage.getItem('token')
    this.newScore.date = new Date().toLocaleDateString();
    this.newScore.game = "Preguntados";
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

    this.apiCountries.getCountries().subscribe(countries => {

      this.allCountriesApi = countries;

      for (let i = 0; i < 4; i++) {
        var randomNumberCountry = Math.floor(Math.random() * (249 - 0) + 0);
        // var randomPosition = Math.floor(Math.random() * 4);

        if (i == 0) {
          // console.log("randooooom", randomPosition);
          this.chosenCountry = this.allCountriesApi[randomNumberCountry];
        }

        this.countryOptions.push(this.allCountriesApi[randomNumberCountry]);
      }
    })
  }

  chooseCountry(country: any) {
    if (country == this.chosenCountry) {
      this.score++;
      this.empty();
      this.startGame();
    } else {
      this.empty();
      this.stopGame();
    }
  }

  empty() {
    this.chosenCountry = '';
    while (this.countryOptions.length) {
      this.countryOptions.pop();
    }
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
    this.gameScore.create(this.newScore);
    this.alert('info', 'Guardando puntaje');
  }
}