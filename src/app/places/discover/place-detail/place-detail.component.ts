import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, take } from 'rxjs';

import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/bookings.service';
import { User } from '../../../../app/auth/auth.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  @Input() selectedPlace!: Places;
  bookable: boolean = false;
  hasLoadedPlace: boolean = true;
  isLoading: boolean = false;

  private placesSub!: Subscription;
  private paramId!: string;
  private user!: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bookingService: BookingsService,
    private placeServices: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.paramId = params.get('placeId') as string;

      this.placesSub = this.authService.user
        .pipe(
          take(1),
          switchMap((usr) => {
            if (usr == null) {
              this.hasLoadedPlace = false;
              throw new Error('Not authenticated');
            }
            this.user = usr;
            return this.placeServices.placesById(this.paramId);
          })
        )
        .subscribe({
          next: (place) => {
            if (Object.keys(place).length === 0) {
              this.fetchById();
            } else {
              this.selectedPlace = place;
              this.bookable = this.selectedPlace.userId !== this.user.id;
            }
          },
          error: (error: Error) => {
            this.showErrorAlert(error.message);
          },
        });
    });
  }

  public onButtonClicked() {
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
        this.bookingService
          .addBooking(
            this.user.id,
            this.selectedPlace.id,
            data.firstName,
            data.lastName,
            this.selectedPlace.title,
            data.guestNumber,
            data.availableFrom,
            data.availableTo
          )
          .subscribe();
      });
  }

  private showErrorAlert(message: string) {
    this.alertCtrl
      .create({
        message: message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      })
      .then((al) => {
        al.present();
        return al.onDidDismiss();
      })
      .then(() => {
        this.router.navigateByUrl('/');
      });
  }

  private fetchById() {
    this.hasLoadedPlace = false;
    this.isLoading = true;
    this.placeServices
      .fetchPlacesById(this.paramId)
      .pipe(take(1))
      .subscribe({
        next: (pl) => {
          this.selectedPlace = pl;
          this.bookable = this.selectedPlace.userId !== this.user.id;
          this.hasLoadedPlace = true;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.showErrorAlert('Unauthorized!!!');
        },
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
