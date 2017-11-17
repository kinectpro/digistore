import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { TicketDetailsPage } from '../ticket-details/ticket-details';
import { TicketParams } from '../../../models/params';
import { TicketService } from '../../../providers/ticket-service';

@Component({
  selector: 'page-ticket-search-results',
  templateUrl: 'ticket-search-results.html',
})
export class TicketSearchResultsPage {

  listTickets: any = [];
  params: TicketParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public tickerSrv: TicketService) {
    this.params = navParams.get('params');
    this.tickerSrv.listTickets(this.params).then(
      res => this.listTickets = res,
      err => console.log(err)
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketSearchResultsPage');
  }

  changeStatus(ticket: any) {
    const pageModal = this.modalCtrl.create(TicketDetailsPage, {
      params: this.params,
      result: {
        status: ticket.used_at ? 'failure' : 'success',
        mode: 'modal',
        first_name: ticket.first_name,
        last_name: ticket.last_name,
        email: ticket.email,
        download_url: ticket.download_url,
        id: ticket.id,
        nav: this.navCtrl // pass parent nav
      }
    });
    pageModal.present();
  }

}
