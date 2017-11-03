import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TicketSearchResultsPage } from '../ticket-search-results/ticket-search-results';

@Component({
  selector: 'page-ticket-check',
  templateUrl: 'ticket-check.html',
})
export class TicketCheckPage {

  number: string;
  withoutNumber: boolean;
  searchObj: any = {
    first_name: '',
    last_name: '',
    email: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.withoutNumber = navParams.get('withoutNumber');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketCheckPage');
  }

  findWithoutNumber() {
    this.navCtrl.push(TicketCheckPage, { withoutNumber: true });
  }

  search() {
    this.navCtrl.push(TicketSearchResultsPage);
  }

  check() {
    // todo: check e-ticket
  }

}
