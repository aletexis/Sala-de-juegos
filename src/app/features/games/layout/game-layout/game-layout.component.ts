import { Component } from '@angular/core';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { GameBoardComponent } from '../../../../shared/components/game-board/game-board.component';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { GameScoreComponent } from '../../../../shared/components/game-score/game-score.component';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../core/services/game.service';

@Component({
  selector: 'app-game-layout',
  imports: [
    CommonModule,
    RouterModule,
    ChatComponent,
    GameBoardComponent,
    GameScoreComponent
  ],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.scss'
})
export class GameLayoutComponent {
  currentGameId: string = '';
  currentGameTitle: string = '';
  gameStarted = false;
  gameOver = false;
  finalScore = 0;

  private gameMap: Record<string, { id: string; title: string }> = {
    'ahorcado': { id: 'ahorcado', title: 'Ahorcado' },
    'viborita': { id: 'viborita', title: 'Viborita' },
    'preguntados': { id: 'preguntados', title: 'Preguntados' },
    'mayor-menor': { id: 'mayor-menor', title: '¿Mayor o menor?' }
  };

  constructor(private router: Router, private gameService: GameService) {
    this.router.events.subscribe(event => {
      const url = this.router.url;
      const routeKey = Object.keys(this.gameMap).find(key => url.includes(key));
      if (routeKey) {
        this.currentGameId = this.gameMap[routeKey].id;
        this.currentGameTitle = this.gameMap[routeKey].title;
      }

      if (event instanceof NavigationStart && !event.url.includes('juegos')) {
        this.goLobby();
      }
    });

    this.gameService.gameStarted$.subscribe(started => {
      this.gameStarted = started;
    });

    this.gameService.gameOver$.subscribe(score => {
      this.finalScore = score;
      this.gameOver = true;
      this.gameStarted = false;
    });
  }

  startGame() {
    this.gameOver = false;
    this.finalScore = 0;
    this.gameService.startGame();
  }

  goLobby() {
    this.gameOver = false;
    this.gameStarted = false;
  }
}