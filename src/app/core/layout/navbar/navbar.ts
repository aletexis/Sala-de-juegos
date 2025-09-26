import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private router = inject(Router);
  session = inject(SessionService);

  currentRoute: string = '';

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  isLoggedIn() {
    return this.session.isLoggedIn;
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }

  logout() {
    this.session.logout();
    this.router.navigateByUrl('inicio-sesion');
  }
}