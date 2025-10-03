import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = () => {

  const session = inject(SessionService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  if (session.isLoggedIn) {
    return true;
  } else {
    alertService.info('Primero iniciá sesión');
    router.navigate(['/inicio-sesion']);
    return false;
  }
};
