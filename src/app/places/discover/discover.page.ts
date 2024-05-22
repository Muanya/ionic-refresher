import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';

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
    // this.places = this.placeService.places
  }

  ionViewWillEnter(){
    this.places = this.placeService.places

  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail)

    if(event.detail.value == "all"){
      this.places = this.placeService.places

    }else{
      this.places = this.placeService.places.slice(1)
    }
    }

}
