import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, Validators, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Log } from '../../core/models/log';
import { User } from '../../core/models/user';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;

  constructor(
    private alertService: AlertService,
    private firestoreService: FirestoreService,
    private session: SessionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (controlName === 'email' && control?.hasError('email')) {
      return 'El correo electrónico no es válido';
    }
    if (controlName === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  login() {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.alertService.info('Verificando credenciales');

    const { email, password } = this.loginForm.value;

    this.firestoreService
      .getFiltered<User>('users', 'email', email)
      .subscribe({
        next: users => {
          const user = users.find(u => u.password === password);

          if (user) {
            const log: Log = {
              email: user.email,
              lastLogin: new Date()
            };
            this.firestoreService.create<Log>('logs', log);
            this.session.login(user.email);
            this.alertService.success('Bienvenido/a');
            this.router.navigateByUrl('inicio');
          } else {
            this.alertService.error('Usuario no válido');
          }
        },
        error: err => {
          console.error(err);
          this.alertService.error('Error al verificar credenciales');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  fastLogin() {
    this.loginForm.setValue({
      email: 'invitado@invitado.com',
      password: '123456'
    });
  }
}