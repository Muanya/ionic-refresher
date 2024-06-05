import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';

export const authenticationGuard: CanMatchFn = (route: Route, segment: UrlSegment[]) => {
  return inject(AuthService).isAuthenticatedGuard(false);
};


export const authPageGuard: CanMatchFn = (route: Route, segment: UrlSegment[]) => {
  return inject(AuthService).isAuthenticatedGuard(true);
};

