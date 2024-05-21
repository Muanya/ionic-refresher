import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverPage } from './discover.page';
import { PlaceDetailComponent } from './place-detail/place-detail.component';

const routes: Routes = [
  {
    path: '',
    component: DiscoverPage
  },
  {
    path: 'detail/:placeId',
    component: PlaceDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoverPageRoutingModule {}
