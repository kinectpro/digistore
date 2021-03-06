import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { TicketParams } from '../../../models/params';
import { EventsPage } from '../../../shared/classes/events-page';
import { StorageService } from '../../../providers/storage-service';

@Component({
  selector: 'page-ticket-params',
  templateUrl: 'ticket-params.html',
})
export class TicketParamsPage extends EventsPage {

  pageName: string;
  params: TicketParams;
  paramsFromServer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public store: StorageService, public events: Events) {
    super(events);
    this.pageName = navParams.get('pageName');
    this.params = navParams.get('params');
    this.paramsFromServer = navParams.get('paramsFromServer');
  }

  ionViewDidLoad() {
    console.log('Init TicketParamsPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeParam(kind: string, obj: any) {
    this.params[kind] = obj;
    this.store[kind] = this.params[kind];  // save to LocalStorage
    this.events.publish('ticket-params:changed', this.params);
    this.dismiss();
  }

}
