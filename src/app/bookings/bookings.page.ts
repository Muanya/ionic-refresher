import { Component, OnDestroy, OnInit } from '@angular/core';

import { Bookings } from './bookings.model';
import { BookingsService } from './bookings.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  private _allBookings!: Bookings[];
  private _bookingSub!: Subscription;
  private _deleteSub!: Subscription;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController
  ) {}

  public get bookings(): Bookings[] {
    return this._allBookings;
  }

  onDelete(bId: string) {
    this.loadingCtrl
      .create({
        message: 'Deleting...',
      })
      .then((el) => {
        el.present();
        this._deleteSub =  this.bookingService.delete(bId).subscribe((_) => {
          el.dismiss();
        });
      });
  }

  ngOnInit(): void {
    this._bookingSub = this.bookingService.getBookings().subscribe((bks) => {
      this._allBookings = bks;
    });
  }

  ngOnDestroy(): void {
    if (this._bookingSub) {
      this._bookingSub.unsubscribe();
    }

    if (this._deleteSub) {
      this._deleteSub.unsubscribe();
    }
  }
}
