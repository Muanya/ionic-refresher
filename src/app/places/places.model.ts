export class Places {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string 
  ) {}
}


export interface PlaceRequest {
availableFrom: string
availableTo: string
description: string
imageUrl: string
price: number,
title: string,
userId: string
}
