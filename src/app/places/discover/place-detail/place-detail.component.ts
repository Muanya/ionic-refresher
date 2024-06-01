import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/bookings.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  @Input() selectedPlace!: Places;
  bookable: boolean = false;
  hasLoadedPlace: boolean = true;

  private placesSub!: Subscription;
  private paramId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bookingService: BookingsService,
    private placeServices: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.paramId = params.get('placeId') as string;

      this.placesSub = this.placeServices
        .placesById(this.paramId)
        .subscribe((place) => {
          if (Object.keys(place).length === 0) {
            this.fetchById();
          } else {
            this.selectedPlace = place;
            this.bookable = this.selectedPlace.userId !== this.authService.user;
          }
        });
    });
  }

  private fetchById() {
    this.hasLoadedPlace = false;
    this.placeServices.fetchPlacesById(this.paramId).subscribe((pl) => {
      this.selectedPlace = pl;
      this.bookable = this.selectedPlace.userId !== this.authService.user;
      this.hasLoadedPlace = true;
    });
  }

  onButtonClicked() {
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack("/places/discover")
    this.actionSheetCtrl
      .create({
        buttons: [
          {
            text: 'Pick Date',
            handler: () => this.showModal('pick'),
          },
          {
            text: 'Random',
            handler: () => this.showModal('random'),
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ],
      })
      .then((el) => {
        el.present();
      });
  }

  private showModal(action: 'pick' | 'random') {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { place: this.selectedPlace, action: action },
      })
      .then((el) => {
        el.present();
        return el.onDidDismiss();
      })
      .then((returnData) => {
        const data = returnData.data.bookData;
        this.bookingService.addBooking(
          this.authService.user,
          this.selectedPlace.id,
          data.firstName,
          data.lastName,
          this.selectedPlace.title,
          data.guestNumber,
          data.availableFrom,
          data.availableTo
        ).subscribe();
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
