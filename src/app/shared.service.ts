import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  baseUrl = 'https://ionic-refresh-default-rtdb.firebaseio.com/subBnb';
  placeUrl: string = `${this.baseUrl}/all-places.json`;
  bookingUrl: string = `${this.baseUrl}/all-bookings.json`;

  constructor() { }
}
