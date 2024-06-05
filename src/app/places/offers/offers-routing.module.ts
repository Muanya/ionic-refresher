import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersPage } from './offers.page';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';

const routes: Routes = [
  {
    path: '',
    component: OffersPage,
  },

  {
    path: 'new',
    component: NewOfferComponent,
  },
  {
    path: 'edit/:placeId',
    component: EditOfferComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule {}
