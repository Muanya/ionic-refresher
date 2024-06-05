import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { EMPTY, Observable, catchError, take, tap } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {
  isAuthenticating: boolean = false;
  isLoginMode: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  toggleAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  async authenticate(email: string, password: string) {
    this.isAuthenticating = true;
    let authMode: Observable<AuthResponseData>;

    const el = await this.loadingCtrl.create({
      message: this.isLoginMode ? 'Logging In...' : 'Signing Up...',
    });
    el.present();

    if (this.isLoginMode) {
      authMode = this.authService.login(email, password);
    } else {
      authMode = this.authService.signUp(email, password);
    }

    return authMode.pipe(
      take(1),
      catchError((err, _) => {
        this.isAuthenticating = false;
        el.dismiss();

        this.alertCtrl
          .create({
            message: 'Invalid authentication details!',
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
              },
            ],
          })
          .then((el) => {
            el.present();
          });

        return EMPTY;
      }),
      tap(() => {
        this.isAuthenticating = false;
        el.dismiss();
      })
    );
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    (await this.authenticate(form.value.email, form.value.password)).subscribe({
      next: () => {
        this.router.navigateByUrl('/places');
        form.reset();
      },
    });
  }
}
