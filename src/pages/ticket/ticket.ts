import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App } from 'ionic-angular';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';
import { TicketService } from '../../providers/ticket-service';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  showedCalendar: boolean = false;
  params: any = {
    date: new Date(),
    template: {key: '', value: 'None'},
    location: {key: '', value: 'None'}
  };
  paramsFromServer: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App, public tickServ: TicketService) {
    this.tickServ.getTicketParams().then(
      res => {
        this.paramsFromServer.templates = res.templates;
        this.paramsFromServer.locations = res.locations;
      },
      err => {
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  openPageParams(pageName: string) {
    const pageModal = this.modalCtrl.create(TicketParamsPage, { pageName: pageName, params: this.params, paramsFromServer: this.paramsFromServer });
    pageModal.onDidDismiss(res => {
      this.params = res.params;
      console.log(this.params);
      let sumObj = {};
      for (var prop in this.paramsFromServer.templates) {
        sumObj = Object.assign(sumObj, this.paramsFromServer.templates[prop]);
      }
      console.log(sumObj);
    });
    pageModal.present();
  }

  onChange() {
    this.showedCalendar = !this.showedCalendar;
  }

  scan() {
    this.navCtrl.push(TicketQrScannerPage);
  }
}
