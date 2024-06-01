import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  delay,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { PlaceRequest, Places } from './places.model';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
 
  private _places = new BehaviorSubject<Places[]>([]);

  constructor(private httpClient: HttpClient, private shared: SharedService) {}

  public get places(): Observable<Places[]> {
    return this._places.asObservable();
  }

  public fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: PlaceRequest }>(this.shared.placeUrl)
      .pipe(
        take(1),
        map((res) => {
          const place: Places[] = [];

          for (const key in res) {
            place.push(
              new Places(
                key,
                res[key].title,
                res[key].description,
                res[key].imageUrl,
                res[key].price,
                new Date(res[key].availableFrom),
                new Date(res[key].availableTo),
                res[key].userId
              )
            );
          }

          return place;
        }),

        tap((pls) => {
          this._places.next(pls);
        })
      );
  }

  public placesById(id: string): Observable<Places> {
    return this.places.pipe(
      take(1),
      map((p) => {
        return { ...p.find((el) => el.id === id) } as Places;
      })
    );
  }

  public fetchPlacesById(id: string) {
    const url = `${this.shared.baseUrl}/all-places/${id}.json`;
    return this.httpClient.get<PlaceRequest>(url).pipe( take(1), map(res => {
      return new Places(
        id,
        res.title,
        res.description,
        res.imageUrl,
        res.price,
        new Date(res.availableFrom),
        new Date(res.availableTo),
        res.userId
      );
    }));
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
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      availableFrom,
      availableTo,
      userId
    );

    let generatedId: string;

    return this.httpClient
      .post<{ name: string }>(this.shared.placeUrl, { ...newPlace, id: null })
      .pipe(
        switchMap((res) => {
          generatedId = res.name;
          return this.places;
        }),
        take(1),
        delay(1000),
        tap((place) => {
          newPlace.id = generatedId;
          this._places.next(place.concat(newPlace));
        })
      );
  }

  public updatePlace(updatedPlace: Places) {
    const key = updatedPlace.id;
    let updateUrl = `${this.shared.baseUrl}/all-places/${key}.json`;

    return this.httpClient.put(updateUrl, { ...updatedPlace, id: null }).pipe(switchMap(()=>{
      return this.fetchPlaces();
    }));
  }
}
