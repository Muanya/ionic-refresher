export class Bookings {
  constructor(
    public id: string,
    public userId: string,
    public placeId: string,
    public firstName: string,
    public lastName: string,
    public placeTitle: string,
    public guestNumber: number,
    public dateFrom: Date,
    public dateTo: Date
  ) {}
}

export interface BookingGetData {
  dateFrom: string;
  dateTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeTitle: string;
  userId: string;
}
