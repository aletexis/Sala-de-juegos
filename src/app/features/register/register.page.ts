import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { SessionService } from '../../core/services/session.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private session: SessionService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (controlName === 'email' && control?.hasError('email')) return 'El correo electrónico no es válido';
    if (controlName === 'password' && control?.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  register() {
    if (this.registerForm.invalid || this.loading) return;

    this.loading = true;
    this.alertService.info('Verificando credenciales...');

    const { email, password } = this.registerForm.value;
    const user: User = {
      email: email!,
      password: password!,
      registrerDate: new Date()
    };

    this.firestoreService
      .getFiltered<User>('users', 'email', user.email)
      .pipe(take(1))
      .subscribe({
        next: users => {
          if (!users || users.length === 0) {
            this.firestoreService.create<User>('users', user).then(() => {
              this.session.login(user.email!);
              this.alertService.success('Estás registrado, ¡vamos a jugar!');
              this.router.navigateByUrl('inicio');
            });
          } else {
            this.alertService.info('Ya estás registrado, iniciá sesión');
            this.router.navigateByUrl('inicio-sesion');
          }
        },
        error: err => {
          console.error(err);
          this.alertService.error('Ocurrió un error durante el registro');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}