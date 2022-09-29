import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: any;

  constructor(private router: Router) { this.token = ''; }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token == null) {
      this.router.navigateByUrl("login");
    }
  }

  goTo(place: string) {
    switch (place) {
      case "about-me":
        this.router.navigateByUrl("about-me");
        break;

      case "survey":
        this.router.navigateByUrl("survey");
        break;

      case "logout":
        localStorage.removeItem('token');
        this.router.navigateByUrl("login");
        break;
    }
  }
}
