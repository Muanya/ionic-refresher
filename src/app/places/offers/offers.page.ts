import { Component, OnInit, inject } from '@angular/core';
import { PlacesService } from '../places.service';
import { Places } from '../places.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers : Places[] = []

  constructor(private placeService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.offers = this.placeService.places
  }

  onClickItem(oId:string, slider: IonItemSliding){
    slider.close()
    this.router.navigate(['/', 'places', 'offers', 'edit', oId])
  }

}
