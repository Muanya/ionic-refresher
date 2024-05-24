import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userAuthenticated: boolean = true;

  get userAuthenticated() {
    return this._userAuthenticated;
  }

  constructor() {}

  login() {
    this._userAuthenticated = true;
  }

  logout() {
    this._userAuthenticated = false;
  }

  canMatch(): boolean {
    const router = inject(Router);
    if (!this.userAuthenticated) {
      router.navigateByUrl('/auth');
    }

    return this.userAuthenticated;
  }
}
