import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  token:any;

  playAhorcado() {
    location.assign('/juegos/ahorcado');
  }

  constructor( private router: Router) { this.token = '';} 

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if(this.token == null)
    {
      this.router.navigateByUrl("login");

    }
    
  }

  goEncuesta() {
    location.assign("/encuesta");
  }

  goQuienSoy(){
    location.assign("/quiensoy");
  }

  logout(){

    localStorage.removeItem('token');
    this.router.navigateByUrl("login");
  }
}
