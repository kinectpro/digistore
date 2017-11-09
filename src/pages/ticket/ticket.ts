import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App, ToastController, Events } from 'ionic-angular';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';
import { TicketService } from '../../providers/ticket-service';
import { TicketParams } from '../../models/params';
import { TicketScanPage } from './ticket-scan/ticket-scan';
import { TicketCheckPage } from './ticket-check/ticket-check';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  showedCalendar: boolean = false;
  params: TicketParams = {
    template: this.tickServ.template,
    location: this.tickServ.location,
    date: this.getFormatDate(new Date())
  };
  paramsFromServer: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App,
              public tickServ: TicketService, public toastCtrl: ToastController, public events: Events) {

    this.events.subscribe('ticket-params:changed', params => this.params = params);

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
    this.modalCtrl.create(TicketParamsPage, {
      pageName: pageName,
      params: this.params,
      paramsFromServer: this.paramsFromServer
    }).present();
  }

  onChange() {
    this.showedCalendar = !this.showedCalendar;
  }

  scan() {
    if (this.params.template.key && this.params.location.key) {
      this.navCtrl.push(TicketQrScannerPage, { params: this.params });
      // ------------------------- for test without scanner ------------------
      // this.params.ticket = '38428864604555194810';
      // this.navCtrl.push(TicketScanPage, { params: this.params });
    }
    else {
      this.toastCtrl.create({
        message: 'No "E-Ticket template" or "Event location" field is selected!',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  findWithoutNumber() {
    if (this.params.template.key && this.params.location.key)
      this.navCtrl.push(TicketCheckPage, { params: this.params, withoutNumber: true });
    else {
      this.toastCtrl.create({
        message: 'No "E-Ticket template" or "Event location" field is selected!',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  /**
   * The method returns the date in the format YYYY-MM-DD
   * @param date
   * @returns {string}
   */
  private getFormatDate(date): string {

    let DD = date.getDate();
    if (DD < 10) DD = '0' + DD;

    let MM = date.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;

    let YYYY = date.getFullYear();

    return YYYY + '-' + MM + '-' + DD;
  }
}
