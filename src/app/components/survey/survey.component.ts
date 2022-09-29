import { SurveyService } from '../../services/survey.service';
import { User } from '../../classes/user';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Survey } from 'src/app/models/survey';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  collection = '/surveys';
  survey: Survey = new Survey;
  user: User | undefined;

  surveyForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    surname: new FormControl('', [
      Validators.required
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(99)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.maxLength(10)
    ]),
    foundBy: new FormControl('', [
      Validators.required
    ]),
    liked: new FormControl(''),
    favGames: new FormControl('', [
      Validators.required
    ]),
    recommended: new FormControl('', [
      Validators.required
    ])
  });

  constructor(private dialog: MatDialog, private router: Router, private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || "{}");
    this.surveyForm.patchValue({
      liked: 5
    });
  }

  sendSurvey() {
    this.survey.user = localStorage.getItem('token');
    this.survey.name = this.surveyForm.get('name')?.value;
    this.survey.surname = this.surveyForm.get('surname')?.value;
    this.survey.age = this.surveyForm.get('age')?.value;
    this.survey.phone = this.surveyForm.get('phone')?.value;
    this.survey.foundBy = this.surveyForm.get('foundBy')?.value;
    this.survey.liked = this.surveyForm.get('liked')?.value;
    this.survey.favGames = this.surveyForm.get('favGames')?.value;
    this.survey.recommended = this.surveyForm.get('recommended')?.value;

    this.surveyService.create(this.survey);
    this.alert('success', 'Gracias por tus comentarios 🙂​')

    setTimeout(() => {
      location.assign("/home")
    }, 1900);
  }

  alert(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: text
    })
  }

  goTo(place: string) {
    switch (place) {
      case "home":
        this.router.navigateByUrl("home");
        break;

      case "logout":
        localStorage.removeItem('token');
        this.router.navigateByUrl("login");
        break;
    }
  }
}
