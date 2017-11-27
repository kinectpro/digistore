import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { DOCUMENT } from '@angular/common';

import { TicketDetailsPage } from '../ticket-details/ticket-details';
import { TicketParams } from '../../../models/params';
import { TicketService } from '../../../providers/ticket-service';

@Component({
  selector: 'page-ticket-scan',
  templateUrl: 'ticket-scan.html',
})
export class TicketScanPage {

  params: TicketParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public ticketSrv: TicketService, @Inject(DOCUMENT) private document: any, public events: Events) {
    this.params = navParams.get('params');
  }

  ionViewDidLoad() {

    console.log('Init TicketScanPage');

    this.document.body.classList.add('hidden-tabbar-when-scan');

    this.ticketSrv.validateTicket(this.params).then(
      res => {
        this.navCtrl.push(TicketDetailsPage, { params: this.params, result: res }).then( () => this.dismiss() );
      },
      err => {
        this.navCtrl.push(TicketDetailsPage, {
          params: this.params,
          result: {
            status: 'failure',
            msg: err
          }
        }).then( () => this.dismiss() );
      }
    );

  }

  dismiss() {
    this.viewCtrl.dismiss();    
  }

  ionViewDidEnter() {
    this.events.publish('modalState:changed', true);
  }

  ionViewWillLeave() {
    this.document.body.classList.remove('hidden-tabbar-when-scan');
    this.events.publish('modalState:changed', false);
  }

}
