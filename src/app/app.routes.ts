import { Routes } from '@angular/router';
import { HomePage } from './features/home/home.page';
import { LoginPage } from './features/login/login.page';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
	{ path: 'inicio-sesion', component: LoginPage },
	{ path: 'inicio', component: HomePage, canActivate: [authGuard] },
	{
		path: 'registro',
		loadComponent: () =>
			import('./features/register/register.page').then(m => m.RegisterPage)
	},
	{
		path: 'sobre-mi',
		loadComponent: () =>
			import('./features/about-me/about-me.page').then(m => m.AboutMePage)
	},
	{
		path: 'encuesta',
		loadComponent: () =>
			import('./features/survey/survey.component').then(m => m.SurveyComponent),
		canActivate: [authGuard]
	},
	{
		path: 'juegos',
		loadChildren: () =>
			import('./features/games/games-module').then(m => m.GamesModule),
		canActivate: [authGuard]
	},
	{
		path: '**',
		loadComponent: () =>
			import('./features/not-found/not-found.page').then(m => m.NotFoundPage)
	},
];