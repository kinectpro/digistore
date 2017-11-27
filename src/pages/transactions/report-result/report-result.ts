import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';

@Component({
  selector: 'page-report-result',
  templateUrl: 'report-result.html',
})
export class ReportResultPage {
  status: string;
  message: string;
  order_id: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public events: Events) {
    this.status = this.navParams.get('status');
    this.message = this.navParams.get('message');
    this.message = this.navParams.get('order_id');
  }

  ionViewDidLoad() {
    console.log('Init ReportResultPage');
  }

  ionViewDidEnter() {
    this.events.publish('modalState:changed', true);
  }

  ionViewWillLeave() {
    this.events.publish('modalState:changed', false);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
