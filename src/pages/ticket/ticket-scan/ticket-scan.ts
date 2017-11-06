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
    console.log(this.params.eticket_id);
    console.log(this.params.date);
    console.log(this.params.template_id.key);
    console.log(this.params.location_id.key);
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad TicketScanPage');

    document.body.classList.add('hidden-tabbar-when-scan');
    //
    // this.ticketSrv.validateTicket(this.params).then(
    //   res => {
    //     let result: any;
    //     if (res.status == 'success') {
    //       result = {
    //         title: 'E-Ticket valid!',
    //       }
    //     }
    //
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );

    let loading = this.loadingCtrl.create({
      content: 'loading',
      spinner: 'dots'
    });

    loading.present();

    setTimeout(() => {
      this.navCtrl.push(TicketDetailsPage, {
        result: {
          title: 'Title',
          message: 'Abrakadabre abrakadabra abrakadabra abrakadabra asdasd asd as dd daa daa',
          status: 'invalid',  // success, invalid or cancel
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
      }).then( () => {
        this.viewCtrl.dismiss();
        loading.dismiss();
      });
    },1000);

  }

  dismiss() {
    this.viewCtrl.dismiss();    
  }

  ionViewWillLeave() {
    document.body.classList.remove('hidden-tabbar-when-scan');
  }

}
