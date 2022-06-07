import { EncuestaComponent } from './components/encuesta/encuesta.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MayorMenorComponent } from './components/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './components/preguntados/preguntados.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: 'registro', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule) },
  { path: 'quiensoy', loadChildren: () => import('./components/about-me/about-me.module').then(m => m.AboutMeModule) },
  { path: 'home', loadChildren: () => import('./components/principal/principal.module').then(m => m.PrincipalModule) },
  { path: 'encuesta', component: EncuestaComponent },
  
  {
    path: 'juegos',

    children:
      [
        { path: 'ahorcado', component: AhorcadoComponent },
        { path: 'preguntados', component: PreguntadosComponent },
        { path: 'mayor-menor', component: MayorMenorComponent },
        { path: 'viborita', loadChildren: () => import('./components/viborita/viborita.module').then(m => m.ViboritaModule) },
      ]
  },

  { path: '**', loadChildren: () => import('./components/not-found/not-found.module').then(m => m.NotFoundModule) },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }