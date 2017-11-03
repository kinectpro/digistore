import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TicketDetailsPage } from '../ticket-details/ticket-details';

@Component({
  selector: 'page-ticket-search-results',
  templateUrl: 'ticket-search-results.html',
})
export class TicketSearchResultsPage {

  orders: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.orders = [{
      id: 'kjas6njn8',
      status: true
    }, {
      id: 'hj3s6njn8',
      status: false
    }, {
      id: 'kjav6nvn8',
      status: false
    }];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketSearchResultsPage');
  }

  changeStatus(order: any) {
    const pageModal = this.modalCtrl.create(TicketDetailsPage, {
      result: {
        title: 'Title',
          message: 'Abrakadabre abrakadabra abrakadabra abrakadabra asdasd asd as dd daa daa',
          status: order.status ? 'success' : 'cancel',  // success, invalid or cancel
          date: '2016-09-23',
          location_id: 3,
          template_id: 3,
          id: 1234567890,
          purchase_item_id: 12345678,
          email: 'firstname.lastname@some-email.de',
          first_name: 'Klaus',
          last_name: 'Meier',
          is_blocked: false
      }
    });
    pageModal.onDidDismiss(res => {
      //this.params = res.params;
    });
    pageModal.present();
  }

}
