import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Places } from '../places.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers : Places[] = []

  constructor(private placeService: PlacesService) { }

  ngOnInit() {
    this.offers = this.placeService.places
  }

}
