import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  @Input() game!: string;
  score: number = 0;
  tries: number = 0;

  private scoreSubscription: Subscription | undefined;
  private triesSubscription: Subscription | undefined;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.scoreSubscription = this.gameService.score$.subscribe(score => {
      this.score = score;
    });

    this.triesSubscription = this.gameService.tries$.subscribe(tries => {
      this.tries = tries;
    });
  }

  ngOnDestroy(): void {
    if (this.scoreSubscription) this.scoreSubscription.unsubscribe();
    if (this.triesSubscription) this.triesSubscription.unsubscribe();
  }
}