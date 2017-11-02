import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TicketScanPage } from './ticket-scan/ticket-scan';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  date: any = new Date();
  showedCalendar: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public barcodeScanner: BarcodeScanner) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  openPageParams(pageName: string) {
    const pageModal = this.modalCtrl.create(TicketParamsPage, { pageName: pageName });
    pageModal.onDidDismiss(res => {
      //this.params = res.params;
    });
    pageModal.present();
  }

  onChange() {
    console.log(this.date);
    this.showedCalendar = !this.showedCalendar;
  }

  scan() {
    this.barcodeScanner.scan({ formats: 'QR_CODE'}).then((barcodeData) => {
      const pageTicketScan = this.modalCtrl.create(TicketScanPage, { barcodeData: barcodeData.text });
      pageTicketScan.present();
    }, (err) => {
      console.log(err);
    });

    // this.modalCtrl.create(TicketScanPage, { barcodeData: 'some barcode' }).present();  // for test
  }
}
