import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoggingIn: boolean = false;
  isLoginMode: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  toggleAuthMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  userLogin() {
    this.isLoggingIn = true;

    this.loadingCtrl
      .create({
        message: this.isLoginMode ? 'Logging In...': 'Signing Up...',
      })
      .then((el) => {
        el.present();

        setTimeout(() => {
          this.authService.login();
          this.router.navigateByUrl('/places');
          el.dismiss();
          this.isLoggingIn = false;
        }, 2000);
      });
  }

  onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }
    console.log(form.value.email, form.value.password);
    if(this.isLoginMode){
      this.userLogin()
    }else{

      // signup logic
      
    }
    
  }
}
