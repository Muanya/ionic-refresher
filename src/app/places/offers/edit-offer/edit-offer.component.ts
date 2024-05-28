import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Places } from '../../places.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent implements OnInit, OnDestroy {
  @Input() selectedPlace!: Places;
  form!: FormGroup;
  private placesSub!: Subscription;


  constructor(
    private activatedRoute: ActivatedRoute,
    private placeServices: PlacesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      var id = param.get('placeId') as string;
      this.placesSub = this.placeServices.placesById(id).subscribe(
        (p) => (this.selectedPlace = p)
      );

      this.form = new FormGroup({
        title: new FormControl(this.selectedPlace.title, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),

        description: new FormControl(this.selectedPlace.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(200)],
        }),

        price: new FormControl(this.selectedPlace.price, {
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
    });
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form);
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
