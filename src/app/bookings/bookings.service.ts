import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, take, tap } from 'rxjs';

import { Bookings } from './bookings.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Bookings[]>([
    {
      id: 'b1',
      userId: 'p1',
      firstName: 'James',
      lastName: 'John',
      placeTitle: 'Victoria Island',
      guestNumber: 2,
      dateFrom: new Date('2024-06-06'),
      dateTo: new Date('2024-06-16'),
    },
  ]);

  constructor() {}

  ngOnInit() {}

  getBookings(): Observable<Bookings[]> {
    return this._bookings.asObservable();
  }

  addBooking(
    userId: string,
    firstName: string,
    lastName: string,
    place: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Bookings(
      Math.random().toString(),
      userId,
      firstName,
      lastName,
      place,
      guestNumber,
      dateFrom,
      dateTo
    );

    this.getBookings()
      .pipe(take(1))
      .subscribe((bks) => {
        this._bookings.next(bks.concat(newBooking));
      });
  }

  getBookingById(bookId: string) {
    return this.getBookings().pipe(
      take(1),
      tap((bks) => {
        return bks.find((bk) => bk.id === bookId);
      })
    );
  }

  delete(bId: string) {
    return this.getBookings().pipe(
      take(1),
      delay(2000),
      tap((bks) => {
        this._bookings.next(bks.filter((bk) => bk.id !== bId));
      })
    );
  }
}
