import { Injectable } from '@angular/core';
import { Places } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
 
  private _places: Places[] = [
    {
      id: "p1",
      title: "Victoria Island",
      description: "A beautiful city in lagos",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQvvgbAy7SXd4n1DVASF2BGajl1l0q28qB9w8a_OPZ1w&s",
      price: 987.99
    },
    {
      id: "p2",
      title: "Romantica",
      description: "A place to experience the joy of romance",
      imageUrl: "https://i.pinimg.com/originals/08/84/58/088458d264f0f4dfad92442bf7e80bd4.jpg",
      price: 98.92
    },

    {
      id: "p3",
      title: "Foggy Palace",
      description: "A beautiful fog surrouding a great palace",
      imageUrl: "https://www.shutterstock.com/image-photo/hohenschwangau-bavaria-germany-9th-august-260nw-1175541790.jpg",
      price: 87.79
    }
  ]

  constructor() { }

  
  public get places() : Places[] {
    return [...this._places];
  }

  public placesById(id: string): Places {
    return {...this._places.find(el => el.id === id)} as Places
  }

  public deleteById(pId: string){
    this._places = this._places.filter(p => p.id !== pId )
  }
  
}
