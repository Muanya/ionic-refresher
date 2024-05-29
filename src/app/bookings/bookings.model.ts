export class Bookings {
  constructor(
    public id: string,
    public userId: string,
    public firstName: string,
    public lastName: string,
    public placeTitle: string,
    public guestNumber: number,
    public dateFrom: Date,
    public dateTo: Date
  ) {}
}
