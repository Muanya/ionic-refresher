export class Bookings {
  constructor(
    public id: string,
    public pId: string,
    public dateFrom: Date,
    public dateTo: Date
  ) {}
}
