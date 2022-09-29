import { SurveyComponent } from './components/survey/survey.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MayorMenorComponent } from './components/games/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './components/games/preguntados/preguntados.component';
import { AhorcadoComponent } from './components/games/ahorcado/ahorcado.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule) },
  { path: 'about-me', loadChildren: () => import('./components/about-me/about-me.module').then(m => m.AboutMeModule) },
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'survey', component: SurveyComponent },
  {
    path: 'games',
    children:
      [
        { path: 'ahorcado', component: AhorcadoComponent },
        { path: 'preguntados', component: PreguntadosComponent },
        { path: 'mayor-menor', component: MayorMenorComponent },
        { path: 'viborita', loadChildren: () => import('./components/games/viborita/viborita.module').then(m => m.ViboritaModule) },
      ]
  },
  { path: '**', loadChildren: () => import('./components/not-found/not-found.module').then(m => m.NotFoundModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }