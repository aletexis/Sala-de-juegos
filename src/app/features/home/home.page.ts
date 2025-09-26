import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  private router = inject(Router);
  private session = inject(SessionService);

  userEmail$ = this.session.userEmail$;

  games = [
    { title: 'Ahorcado', caption: 'Adiviná y aprendé nuevas palabras', route: '/juegos/ahorcado', icon: '/ahorcado.png' },
    { title: 'Mayor o menor', caption: 'Poné a prueba tu suerte', route: '/juegos/mayor-menor', icon: 'mayor-menor.png' },
    { title: 'Preguntados', caption: '¿Cuánto sabés de países?', route: '/juegos/preguntados', icon: 'preguntados.png' },
    { title: 'Viborita', caption: 'El clásico juego de la viborita', route: '/juegos/viborita', icon: 'viborita.png' }
  ];

  ngOnInit(): void {
    if (!this.session.isLoggedIn) {
      this.router.navigateByUrl("iniciar-sesion");
    }
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}