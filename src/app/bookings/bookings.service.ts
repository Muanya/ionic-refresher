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
import { SharedService } from '../shared.service';
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

    return this.httpClient
      .post<{ name: string }>(this.shared.bookingUrl, {
        ...newBooking,
        id: null,
      })
      .pipe(
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
    const url = `${this.shared.bookingUrl}?orderBy="userId"&equalTo="${this.authService.user}"`;
    return this.httpClient.get<{ [key: string]: BookingGetData }>(url).pipe(
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
    const url = `${this.shared.baseUrl}/all-bookings/${bId}.json`;
    return this.httpClient.delete(url).pipe(
      switchMap(() => {
        return this.getBookings();
      }),
      take(1),
      delay(2000),
      tap((bks) => {
        this._bookings.next(bks.filter((bk) => bk.id !== bId));
      })
    );
  }
}
