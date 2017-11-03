import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, App } from 'ionic-angular';
import { TicketDetailsPage } from '../ticket-details/ticket-details';

@Component({
  selector: 'page-ticket-scan',
  templateUrl: 'ticket-scan.html',
})
export class TicketScanPage {

  barcodeData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public app: App) {
    this.barcodeData = navParams.get('barcodeData');
    console.log(this.barcodeData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketScanPage');

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

}
