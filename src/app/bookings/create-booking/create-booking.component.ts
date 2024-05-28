import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Places } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() place!: Places;
  @Input() action!: 'random' | 'pick';
  @ViewChild('bookForm', { static: true }) form!: NgForm;

  fromDate!: string;
  toDate!: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.action == 'random') {
      this.fromDate = new Date(
        this.getRandomDate(this.place.availableFrom)
      ).toISOString();
      this.toDate = new Date(
        this.getRandomDate(new Date(this.fromDate))
      ).toISOString();
    } else {
      this.fromDate = this.place.availableFrom.toISOString();
      this.toDate = this.place.availableTo.toISOString();
    }
  }

  private getRandomDate(startDate: Date): number {
    return (
      startDate.getTime() +
      Math.floor(
        Math.random() * (this.place.availableTo.getTime() - startDate.getTime())
      )
    );
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form.value);
    console.log(this.form);

    this.modalCtrl.dismiss({ place: this.place, status: 'Booked!' }, 'confirm');
  }
}
