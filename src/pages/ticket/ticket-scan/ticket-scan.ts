import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { TicketDetailsPage } from '../ticket-details/ticket-details';
import { TicketParams } from '../../../models/params';
import { TicketService } from '../../../providers/ticket-service';

@Component({
  selector: 'page-ticket-scan',
  templateUrl: 'ticket-scan.html',
})
export class TicketScanPage {

  params: TicketParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public ticketSrv: TicketService) {
    this.params = navParams.get('params');
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad TicketScanPage');

    document.body.classList.add('hidden-tabbar-when-scan');

    this.ticketSrv.validateTicket(this.params).then(
      res => {
        this.navCtrl.push(TicketDetailsPage, { params: this.params, result: res }).then( () => {
          this.viewCtrl.dismiss();
        });
      },
      err => {
        console.log(err);
      }
    );

  }

  dismiss() {
    this.viewCtrl.dismiss();    
  }

  ionViewWillLeave() {
    document.body.classList.remove('hidden-tabbar-when-scan');
  }

}
