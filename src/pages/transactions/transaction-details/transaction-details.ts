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
    this.tranServ.getTransaction(this.navParams.get('transaction').order_id).then(
      res => this.transaction = res,
      err => this.errSrv.showMessage(err)
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsPage');
  }

  report() {
    this.navCtrl.push(ReportPage, {transaction: this.transaction});
  }

}
