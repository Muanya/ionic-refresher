import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoggingIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  userLogin() {
    this.isLoggingIn = true;

    this.loadingCtrl
      .create({
        message: 'Logging In...',
      })
      .then((el) => {
        el.present();

        setTimeout(() => {
          this.authService.login();
          this.router.navigateByUrl('/places');
          el.dismiss()
          this.isLoggingIn = false;
        }, 2000);
      });
  }
}
