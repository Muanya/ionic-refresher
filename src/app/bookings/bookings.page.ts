import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onBook() {

  }
}
