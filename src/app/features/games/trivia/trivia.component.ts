import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Score } from '../../../core/models/score';
import { AlertService } from '../../../core/services/alert.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SessionService } from '../../../core/services/session.service';
import { GameService } from '../../../core/services/game.service';
import { ApiService } from '../../../core/services/api.service';
import { LoadingService } from '../../../core/services/loading.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-trivia',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './trivia.component.html',
  styleUrl: './trivia.component.scss'
})
export class TriviaComponent {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;

  private sub!: Subscription;
  newScore!: Score;
  score = 0;
  tries = 3;

  allCountries: any[] = [];
  chosenCountry: any = null;
  countryOptions: any[] = [];
  usedCountries: Set<string> = new Set();

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private firestoreService: FirestoreService,
    private session: SessionService,
    private apiCountries: ApiService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.newScore = {
      name: this.session.userEmail ?? 'invitado',
      score: 0,
      date: new Date().toLocaleDateString(),
      game: 'trivia'
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
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);
    this.loadCountries();
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
    this.chosenCountry = null;
    this.countryOptions = [];
    this.gameService.setScore(this.score);
    this.gameService.setTries(this.tries);
  }

  private loadCountries() {
    this.loadingService.startLoading();
    this.apiCountries.getCountries().pipe(take(1)).subscribe({
      next: countries => {
        this.allCountries = countries
          .map((country: any) => ({
            ...country,
            nombreEsp: country.translations?.spa?.common || country.name.common
          }))
          .sort((a: { population: number; }, b: { population: number; }) => b.population - a.population)
          .slice(0, 80);

        this.setOptions();
        this.loadingService.stopLoading();
      },
      error: err => {
        console.error(err);
        this.loadingService.stopLoading();
        this.alertService.error('No se pudieron cargar los países');
      }
    });
  }

  private setOptions() {
    this.countryOptions = [];

    const availableCountries = this.allCountries.filter(
      country => !this.usedCountries.has(country.nombreEsp)
    );

    if (availableCountries.length < 4) {
      this.usedCountries.clear();
    }

    while (this.countryOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * availableCountries.length);
      const candidate = availableCountries[randomIndex];

      if (!this.countryOptions.find(c => c.nombreEsp === candidate.nombreEsp)) {
        this.countryOptions.push(candidate);
      }
    }

    const randomPos = Math.floor(Math.random() * 4);
    this.chosenCountry = this.countryOptions[randomPos];
    this.usedCountries.add(this.chosenCountry.nombreEsp);

    this.restartAnimateCss();
  }

  private restartAnimateCss() {
    const element = this.gameContainer?.nativeElement;
    if (!element) return;
    element.classList.remove('animate__animated', 'animate__slideInRight');
    void element.offsetWidth;
    element.classList.add('animate__animated', 'animate__slideInRight');
  }

  chooseCountry(country: any) {
    if (country.nombreEsp === this.chosenCountry.nombreEsp) {
      this.score++;
      this.gameService.setScore(this.score);
      this.setOptions();
    } else {
      this.tries--;
      this.gameService.setTries(this.tries);
      if (this.tries <= 0) {
        this.finishGame();
      } else {
        this.setOptions();
      }
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