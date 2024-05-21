import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  onButtonClicked(){
    this.navCtrl.navigateBack('/places/offers')

  }

}
