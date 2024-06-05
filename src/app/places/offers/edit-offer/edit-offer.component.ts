import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, take } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Places } from '../../places.model';
import { AuthService } from '../../../../app/auth/auth.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent implements OnInit, OnDestroy {
  @Input() selectedPlace!: Places;
  form: FormGroup = new FormGroup({
    title: new FormControl(null),
    description: new FormControl(null),
    price: new FormControl(null),
  });
  editable: boolean = true;
  private placesSub!: Subscription;
  private paramId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private placeServices: PlacesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.paramId = param.get('placeId') as string;
      this.placesSub = this.placeServices
        .placesById(this.paramId)
        .subscribe((p) => {
          if (Object.keys(p).length === 0) {
            this.fetchById();
          } else {
            this.editable = true;
            this.selectedPlace = p;
            this.initForm();
          }
        });
    });
  }

  private initForm() {
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
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }

    // this.placeServices.updatePlace()

    const dt = this.form.value;

    this.authService.user
      .pipe(
        take(1),
        switchMap((usr) => {
          if (usr == null) {
            throw new Error('Not authenticated');
          }
          const tmp = new Places(
            this.selectedPlace.id,
            dt.title,
            dt.description,
            this.selectedPlace.imageUrl,
            +dt.price,
            new Date(dt.dateFrom),
            new Date(dt.dateTo),
            usr.id
          );

          return this.placeServices.updatePlace(tmp, usr.token!);
        })
      )
      .pipe(take(1))
      .subscribe(() => {
        // this.router.navigate(['/', 'places', 'offers'])
        this.fetchById();
      });
  }

  private fetchById() {
    this.editable = false;

    this.placeServices.fetchPlacesById(this.paramId).subscribe((pl) => {
      this.selectedPlace = pl;
      this.editable = true;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
