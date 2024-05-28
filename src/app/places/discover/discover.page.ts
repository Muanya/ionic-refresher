import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IonSegment,
  SegmentChangeEventDetail,
  SegmentValue,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Places } from '../places.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  public places: Places[] = [];

  @ViewChild('discoverSegment', { static: true })
  private segment!: IonSegment;

  private allPlaces: Places[] = [];
  private placesSub!: Subscription;

  constructor(
    private authService: AuthService,
    private placeService: PlacesService
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((p) => {
      this.allPlaces = p;
      this.places = this.allPlaces;
    });

    this.segment.ionChange.subscribe(event=>{
      this.updateSegment(event.detail.value!);

      
    })
  }

  ionViewDidEnter() {
    this.updateSegment(this.segment.value!);
  }

  
  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  updateSegment(segmentValue: SegmentValue) {
    if (segmentValue == 'all') {
      this.places = this.allPlaces;
    } else {
      this.places = this.allPlaces.filter((pl) => {
        return pl.userId == this.authService.user;
      });
    }
  }
}
