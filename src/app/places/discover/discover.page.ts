import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSegment, SegmentValue } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Places } from '../places.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  public places: Places[] = [];
  isLoadingPlaces: boolean = false;

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

    this.segment.ionChange.subscribe((event) => {
      this.updateSegment(event.detail.value!);
    });
  }

  ionViewWillEnter() {
    this.isLoadingPlaces = true;
    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoadingPlaces = false
    });
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
        return pl.userId !== this.authService.user;
      });
    }
  }
}
