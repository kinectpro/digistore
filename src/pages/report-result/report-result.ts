import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-report-result',
  templateUrl: 'report-result.html',
})
export class ReportResultPage {
  status: string;
  message: string;
  order_id: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.status = this.navParams.get('status');
    this.message = this.navParams.get('message');
    this.message = this.navParams.get('order_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportResultPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
