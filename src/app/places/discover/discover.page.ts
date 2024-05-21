import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Places } from '../places.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  public places: Places[] = []

  constructor(private placeService: PlacesService) { }

  ngOnInit() {

    this.places = this.placeService.places
  }

}
