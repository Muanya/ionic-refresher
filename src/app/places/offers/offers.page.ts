import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Places } from '../places.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Places[] = [];
  isLoadingPlaces: boolean = false;
  private placesSub!: Subscription;

  constructor(private placeService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe(
      (p) => (this.offers = p)
    );
  }

  ionViewWillEnter() {
    this.isLoadingPlaces = true;
    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoadingPlaces = false;
    });
  }

  onClickItem(oId: string, slider: IonItemSliding) {
    slider.close();
    this.router.navigate(['/', 'places', 'offers', 'edit', oId]);
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
