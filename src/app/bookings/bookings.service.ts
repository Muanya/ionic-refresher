import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  delay,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { BookingGetData, Bookings } from './bookings.model';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Bookings[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private shared: SharedService
  ) {}

  ngOnInit() {}

  getBookings(): Observable<Bookings[]> {
    return this._bookings.asObservable();
  }

  addBooking(
    userId: string,
    placeId: string,
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
      placeId,
      firstName,
      lastName,
      place,
      guestNumber,
      dateFrom,
      dateTo
    );

    let generatedId: string;

    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        return this.httpClient.post<{ name: string }>(
          `${this.shared.bookingUrl}?auth=${user?.token}`,
          {
            ...newBooking,
            id: null,
          }
        );
      }),
      switchMap((res) => {
        generatedId = res.name;
        return this.getBookings();
      }),
      take(1),
      tap((bks) => {
        newBooking.id = generatedId;
        this._bookings.next(bks.concat(newBooking));
      })
    );
  }

  public fetchBookings() {
    return this.authService.user.pipe(
      take(1),
      switchMap((usr) => {
        if (usr == null) {
          throw new Error('Not Authenticated');
        }
        const url = `${this.shared.bookingUrl}?auth=${usr.token}&orderBy="userId"&equalTo="${usr.id}"`;
        return this.httpClient.get<{ [key: string]: BookingGetData }>(url);
      }),
      take(1),
      map((res) => {
        const bookings: Bookings[] = [];
        for (const key in res) {
          bookings.push(
            new Bookings(
              key,
              res[key].userId,
              res[key].placeId,
              res[key].firstName,
              res[key].lastName,
              res[key].placeTitle,
              res[key].guestNumber,
              new Date(res[key].dateFrom),
              new Date(res[key].dateTo)
            )
          );
        }

        return bookings;
      }),
      tap((bks) => {
        this._bookings.next(bks);
      })
    );
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
    return this.authService.user.pipe(
      take(1),
      switchMap((user) => {
        const url = `${this.shared.baseUrl}/all-bookings/${bId}.json?auth=${user?.token}`;
        return this.httpClient.delete(url);
      }),
      take(1),
      switchMap(() => {
        return this.getBookings();
      }),
      take(1),
      tap((bks) => {
        this._bookings.next(bks.filter((bk) => bk.id !== bId));
      })
    );
  }
}
