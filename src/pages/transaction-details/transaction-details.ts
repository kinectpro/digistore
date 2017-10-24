import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportPage } from '../report/report';
import { TransactionService } from '../../providers/transaction-service';

@IonicPage()
@Component({
  selector: 'page-transaction-details',
  templateUrl: 'transaction-details.html',
})
export class TransactionDetailsPage {
  transaction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public tranServ: TransactionService) {
    this.tranServ.getTransaction(this.navParams.get('transaction').order_id).then(
      res => this.transaction = res,
      err => console.log(err)
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsPage');
  }

  report() {
    this.navCtrl.push(ReportPage);
  }

}
