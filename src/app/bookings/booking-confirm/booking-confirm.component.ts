import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Places } from 'src/app/places/places.model';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.scss'],
})
export class BookingConfirmComponent implements OnInit {
  @Input() data!: Places;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBook() {
    this.modalCtrl.dismiss({ place: this.data, status: 'Booked!' }, 'confirm');
  }
}
