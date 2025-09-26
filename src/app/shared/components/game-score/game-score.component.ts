import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Score } from '../../../core/models/score';
import { LoadingService } from '../../../core/services/loading.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-game-score',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss'
})
export class GameScoreComponent implements OnInit {

  @Input() game!: string;
  scores: Score[] = [];

  constructor(private firestoreService: FirestoreService, public loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.startLoading();

    this.firestoreService.getAll<Score>('scores')
      .subscribe(allScores => {
        this.scores = allScores
          .filter(s => s.game && s.game.toLowerCase() === this.game.toLowerCase())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        this.loadingService.stopLoading()
      });
  }
}