import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ReportPage } from '../report/report';
import { TransactionService } from '../../../providers/transaction-service';
import { ErrorService } from '../../../providers/error-service';

@Component({
  selector: 'page-transaction-details',
  templateUrl: 'transaction-details.html',
})
export class TransactionDetailsPage {
  transaction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public tranServ: TransactionService, public errSrv: ErrorService) {
    // Device to not use getPurchase function, probably will need it in the future
    // this.tranServ.getTransaction(this.navParams.get('transaction').order_id).then(
    //   res => this.transaction = res,
    //   err => this.errSrv.showMessage(err)
    // );
    this.transaction = this.navParams.get('transaction');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsPage');
  }

  report() {
    this.navCtrl.push(ReportPage, {transaction: this.transaction});
  }

}
