import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {

  token: any;

  constructor(private router: Router) { this.token = ''; }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

  goTo(place: string) {
    switch (place) {
      case "home":
        this.router.navigateByUrl("home");
        break;

      case "login":
        this.router.navigateByUrl("login");
        break;

      case "logout":
        localStorage.removeItem('token');
        this.router.navigateByUrl("login");
        break;
    }
  }
}