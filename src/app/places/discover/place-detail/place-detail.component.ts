import { Component, Input, OnInit } from '@angular/core';
import { Places } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { ModalController } from '@ionic/angular';
import { BookingConfirmComponent } from '../../../bookings/booking-confirm/booking-confirm.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
})
export class PlaceDetailComponent implements OnInit {
  @Input() selectedPlace!: Places;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeServices: PlacesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      var id = params.get('placeId') as string;

      this.selectedPlace = this.placeServices.placesById(id);
    });
  }

  onButtonClicked() {
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack("/places/discover")
    this.modalCtrl.create({
      component: BookingConfirmComponent,
      componentProps: {data: this.selectedPlace}
    }).then(el => {
      el.present()
      return el.onDidDismiss()   
    }).then(returnEl => {
      console.log(returnEl)
    })
  
  }
}
