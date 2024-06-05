import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';
import { OffersPage } from './offers.page';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OffersPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    OffersPage,
    EditOfferComponent,
    NewOfferComponent,
    OfferItemComponent,
  ],
})
export class OffersPageModule {}
