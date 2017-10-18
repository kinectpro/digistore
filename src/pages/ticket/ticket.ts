import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TransactionsPage } from '../transactions/transactions';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  openPeriod() {
    this.navCtrl.push(TransactionsPage, {period: 'day'});
  }

}
