import { Injectable } from '@angular/core';
import { Places } from './places.model';
import { BehaviorSubject, Observable, delay, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Places[]>([
    {
      id: 'p1',
      title: 'Victoria Island',
      description: 'A beautiful city in lagos',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQvvgbAy7SXd4n1DVASF2BGajl1l0q28qB9w8a_OPZ1w&s',
      price: 987.99,
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-12-01'),
      userId: 'user1',
    },
    {
      id: 'p2',
      title: 'Romantica',
      description: 'A place to experience the joy of romance',
      imageUrl:
        'https://i.pinimg.com/originals/08/84/58/088458d264f0f4dfad92442bf7e80bd4.jpg',
      price: 98.92,
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-12-01'),
      userId: 'user2',
    },

    {
      id: 'p3',
      title: 'Foggy Palace',
      description: 'A beautiful fog surrouding a great palace',
      imageUrl:
        'https://www.shutterstock.com/image-photo/hohenschwangau-bavaria-germany-9th-august-260nw-1175541790.jpg',
      price: 87.79,
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-12-01'),
      userId: 'user1',
    },
  ]);

  constructor() {}

  public get places(): Observable<Places[]> {
    return this._places.asObservable();
  }

  public placesById(id: string): Observable<Places> {
    return this.places.pipe(
      take(1),
      map((p) => {
        return { ...p.find((el) => el.id === id) } as Places;
      })
    );
  }

  public deleteById(pId: string) {
    this.places.pipe(
      take(1),
      tap((places) => {
        places = places.filter((p) => p.id !== pId);
        this._places.next(places);
      })
    );
  }

  public addPlace(
    title: string,
    description: string,
    imageUrl: string,
    price: number,
    availableFrom: Date,
    availableTo: Date,
    userId: string
  ) {
    const newPlace = new Places(
      'p' + Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      availableFrom,
      availableTo,
      userId
    );
    
    return this.places.pipe(take(1), delay(2000), tap(place =>{
      place.push(newPlace)
      this._places.next(place)

    }))
  }
}
