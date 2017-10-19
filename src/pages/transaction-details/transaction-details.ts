import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportPage } from '../report/report';

/**
 * Generated class for the TransactionDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-details',
  templateUrl: 'transaction-details.html',
})
export class TransactionDetailsPage {
  transaction:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.transaction = this.navParams.get('transaction');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsPage');
  }

  report() {
    this.navCtrl.push(ReportPage);
  }

}
