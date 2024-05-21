import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: PlacesPage,
    children: [
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full'
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./offers/offers.module').then((m) => m.OffersPageModule),
      },
      {
        path: 'discover',
        loadChildren: () =>
          import('./discover/discover.module').then(
            (m) => m.DiscoverPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
