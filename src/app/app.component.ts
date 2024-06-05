import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private hasLoggedInPrevious: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.userAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.hasLoggedInPrevious) {
        this.router.navigate(['/', 'auth']);
      }

      this.hasLoggedInPrevious = isAuth
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  userLogout() {
    this.authService.logout();
  }
}
