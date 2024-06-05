import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import {
  BehaviorSubject,
  Observable,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponseData, RefreshResponseData, User } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User | null>(null);
  private _logoutTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnDestroy(): void {
    if (this._logoutTimer) {
      clearTimeout(this._logoutTimer);
    }
  }

  get userAuthenticated(): Observable<boolean> {
    return this._user.pipe(map((usr) => !(!usr || !usr.isValid)));
  }

  public get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  public signUp(email: string, password: string): Observable<AuthResponseData> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;

    let data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.httpClient
      .post<AuthResponseData>(url, data)
      .pipe(take(1), tap(this.AuthResponseToUser.bind(this)));
  }

  public login(email: string, password: string): Observable<AuthResponseData> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;

    let data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.httpClient
      .post<AuthResponseData>(url, data)
      .pipe(take(1), tap(this.AuthResponseToUser.bind(this)));
  }

  public refreshUser() {
    const url = `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseApiKey}`;

    return this.user.pipe(
      take(1),
      switchMap((user) => {
        let data = {
          grant_type: 'refresh_token',
          refresh_token: user?.refreshToken,
        };
        return this.httpClient.post<RefreshResponseData>(url, data).pipe(
          take(1),
          tap((data) => {
            if (!!user && user.id === data.user_id) {
              const exp = this.getExpiryDate(+data.expires_in);
              user.refresh(data.access_token, data.refresh_token, exp);

              this.storeCredentials(
                user.id,
                user.email,
                data.access_token,
                exp.toISOString(),
                data.refresh_token
              );

              this.autoLogout(user.tokenValidDuration);
            }
          })
        );
      })
    );
  }

  public logout() {
    if (this._logoutTimer) {
      clearTimeout(this._logoutTimer);
    }

    this._user.next(null);

    // delete user token
    this.removeCredentials().subscribe();
  }

  autoLogout(duration: number) {
    const fos = 2000; // factor of safety of 2 mins
    let timeToRefresh: number = duration < fos ? 0 : duration - fos;

    if (this._logoutTimer) {
      clearTimeout(this._logoutTimer);
    }
    this._logoutTimer = setTimeout(() => {
      this.refreshUser().subscribe({
        error: () => {
          this.logout();
        },
      });
    }, timeToRefresh);
  }

  public isAuthenticatedGuard(isAuthPage: boolean): Observable<boolean> {
    return this.userAuthenticated.pipe(
      take(1),
      switchMap((isAuth) => {
        if (!isAuth) {
          return this.autoLogin();
        } else {
          return of(isAuth);
        }
      }),
      switchMap((isAuth) => {
        return isAuthPage ? of(!isAuth) : of(isAuth);
      }),
      tap((isAuth) => {
        if (!isAuth && !isAuthPage) {
          this.router.navigateByUrl('/auth');
        } else if(!isAuth && isAuthPage) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }

  private AuthResponseToUser(data: AuthResponseData) {
    const exp = this.getExpiryDate(+data.expiresIn);

    console.log(data);

    // const exp = new Date(new Date().getTime() + +data.expiresIn * 1000);
    const usr = new User(
      data.localId,
      data.email,
      data.idToken,
      data.refreshToken,
      exp
    );
    this._user.next(usr);

    this.storeCredentials(
      data.localId,
      data.email,
      data.idToken,
      exp.toISOString(),
      data.refreshToken
    );

    this.autoLogout(usr.tokenValidDuration);
  }

  private getExpiryDate(sec: number): Date {
    return new Date(new Date().getTime() + sec * 1000);
  }

  private autoLogin(): Observable<boolean> {
    return from(Preferences.get({ key: environment.credentialKey })).pipe(
      map((data) => {
        if (!data || !data.value) {
          return null;
        }
        const parsedData = JSON.parse(data.value) as {
          userId: string;
          token: string;
          expiresIn: string;
          email: string;
          refreshToken: string;
        };

        const usr = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          parsedData.refreshToken,
          new Date(parsedData.expiresIn)
        );

        if (!usr.isValid) {
          return null;
        }

        this.autoLogout(usr.tokenValidDuration);
        return usr;
      }),

      tap((usr) => this._user.next(usr)),
      map((usr) => !!usr)
    );
  }

  private storeCredentials(
    userId: string,
    email: string,
    token: string,
    expDate: string,
    refreshToken: string
  ) {
    let val = JSON.stringify({
      userId: userId,
      token: token,
      expiresIn: expDate,
      email: email,
      refreshToken: refreshToken,
    });
    Preferences.set({
      key: environment.credentialKey,
      value: val,
    });
  }

  private removeCredentials(): Observable<void> {
    return from(Preferences.remove({ key: environment.credentialKey })).pipe(
      take(1)
    );
  }
}
