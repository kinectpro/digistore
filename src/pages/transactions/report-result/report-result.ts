import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';

import { EventsPage } from '../../../shared/classes/events-page';

@Component({
  selector: 'page-report-result',
  templateUrl: 'report-result.html',
})
export class ReportResultPage extends EventsPage {
  status: string;
  message: string;
  order_id: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public events: Events) {
    super(events);
    this.status = this.navParams.get('status').toUpperCase();
    this.message = this.navParams.get('message');
    this.order_id = this.navParams.get('order_id');
  }

  ionViewDidLoad() {
    console.log('Init ReportResultPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
