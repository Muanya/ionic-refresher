import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PlacesService } from '../../places.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss'],
})
export class NewOfferComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private placeService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),

      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)],
      }),

      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),

      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),

      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({
      message: "Creating"
    }).then(p => {
      p.present()
    })

    var formValue = this.form.value;

    console.log("creating..")

    this.placeService.addPlace(
      formValue.title,
      formValue.description,
      'https://media.timeout.com/images/105790330/image.jpg',
      +formValue.price,
      new Date(formValue.dateFrom),
      new Date(formValue.dateTo),
      this.authService.user
    ).subscribe(p =>{
      this.loadingCtrl.dismiss()
      this.router.navigate(['/', 'places', 'offers'])

    });

  }
}
