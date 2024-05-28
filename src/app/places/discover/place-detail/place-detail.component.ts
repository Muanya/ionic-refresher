import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  @Input() selectedPlace!: Places;
  private placesSub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeServices: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      var id = params.get('placeId') as string;

      this.placesSub = this.placeServices
        .placesById(id)
        .subscribe((place) => (this.selectedPlace = place));
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
      .then((returnEl) => {
        console.log(returnEl);
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
