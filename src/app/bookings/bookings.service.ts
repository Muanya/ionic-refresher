import { Injectable } from "@angular/core";

import { Bookings } from "./bookings.model";

@Injectable({
    providedIn: 'root'
})
export class BookingsService{
    private _allBookings: Bookings[] = [
        {
            id: 'b1',
            pId: 'p1',
            dateFrom: new Date('2024-06-06'),
            dateTo: new Date('2024-06-16')
        }
    ];

    
    constructor(){}
}