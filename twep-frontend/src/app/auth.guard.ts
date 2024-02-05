import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateChildFn = (route, state) => {
  const authenticated: boolean = inject(AuthService).isLoggedIn();
  if (!authenticated) {
    return inject(Router).navigateByUrl("login")
  }
  const currentPath: string = state.url;
  const role: string | null = inject(AuthService).getLoggedInUserRole();
  if (currentPath.startsWith("/admin") && role !== "management") {
    return inject(Router).navigateByUrl("notfound")
  }

  return true;
};
