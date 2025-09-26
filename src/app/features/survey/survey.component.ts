import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { Survey } from '../../core/models/survey';
import { AlertService } from '../../core/services/alert.service';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../core/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  surveyForm: FormGroup;
  availableGames = ['Ahorcado', 'Preguntados', 'Mayor o Menor', 'Viborita'];

  constructor(
    private firestore: FirestoreService,
    private alert: AlertService,
    private session: SessionService
  ) {
    this.surveyForm = this.fb.group({
      fullName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
      ]),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99)]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,10}$/)
      ]),
      favGames: new FormArray([], [Validators.required]),
      comments: new FormControl('', [Validators.required]),
      revisit: new FormControl('', [Validators.required]),
      satisfaction: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(10)])
    });
  }

  onCheckboxChange(event: any) {
    const favGames = this.surveyForm.get('favGames') as FormArray;
    if (event.target.checked) {
      favGames.push(new FormControl(event.target.value));
    } else {
      const index = favGames.controls.findIndex(x => x.value === event.target.value);
      if (index >= 0) favGames.removeAt(index);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.surveyForm.get(controlName);

    if (control?.hasError('required')) {
      switch (controlName) {
        case 'fullName': return 'El nombre es obligatorio';
        case 'age': return 'La edad es obligatoria';
        case 'phone': return 'El teléfono es obligatorio';
        case 'favGames': return 'Seleccioná al menos un juego';
        case 'satisfaction': return 'Indicá tu nivel de satisfacción';
        case 'revisit': return 'Debes indicar si volverías a jugar';
        case 'comments': return 'Por favor dejá tu experiencia o sugerencias';
      }
    }

    if (controlName === 'fullName' && control?.hasError('pattern')) {
      return 'Sólo se permiten letras y espacios';
    }

    if (controlName === 'age') {
      if (control?.hasError('min')) return 'La edad debe ser mayor o igual a 18 años';
      if (control?.hasError('max')) return 'La edad debe ser menor o igual a 99 años';
    }

    if (controlName === 'phone') {
      if (control?.hasError('pattern')) return 'Sólo números (máx. 10 dígitos)';
    }

    return '';
  }

  sendSurvey() {
    if (this.surveyForm.invalid) return;

    const survey: Survey = {
      user: this.session.userEmail ?? 'anon',
      fullName: this.surveyForm.get('fullName')?.value ?? '',
      age: Number(this.surveyForm.get('age')?.value) ?? 0,
      phone: this.surveyForm.get('phone')?.value ?? '',
      favGames: (this.surveyForm.get('favGames') as FormArray).value,
      satisfaction: this.surveyForm.get('satisfaction')?.value ?? 3,
      revisit: this.surveyForm.get('revisit')?.value ?? '',
      comments: this.surveyForm.get('comments')?.value ?? ''
    };

    this.firestore.create('/surveys', survey)
      .then(() => {
        this.alert.success('¡Gracias por participar en la encuesta 🎉!');
        this.surveyForm.reset();
        this.router.navigateByUrl('inicio');
      })
      .catch(() => this.alert.error('Error al enviar la encuesta'));
  }
}
