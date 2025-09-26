import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameLayoutComponent } from './layout/game-layout/game-layout.component';

const routes: Routes = [
  {
    path: '',
    component: GameLayoutComponent,
    children: [
      {
        path: 'ahorcado',
        loadComponent: () => import('./hangman/hangman.component').then(m => m.HangmanComponent)
      },
      {
        path: 'viborita',
        loadComponent: () => import('./snake/snake.component').then(m => m.SnakeComponent)
      },
      {
        path: 'preguntados',
        loadComponent: () => import('./trivia/trivia.component').then(m => m.TriviaComponent)
      },
      {
        path: 'mayor-menor',
        loadComponent: () => import('./higher-lower/higher-lower.component').then(m => m.HigherLowerComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
