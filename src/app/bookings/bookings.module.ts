import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingsPageRoutingModule } from './bookings-routing.module';

import { BookingsPage } from './bookings.page';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingsPageRoutingModule
  ],
  declarations: [BookingsPage, BookingConfirmComponent]
})
export class BookingsPageModule {}
