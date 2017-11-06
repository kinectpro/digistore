import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App, ToastController } from 'ionic-angular';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';
import { TicketService } from '../../providers/ticket-service';
import { TicketParams } from '../../models/params';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  showedCalendar: boolean = false;
  params: TicketParams = {
    eticket_id: '',
    template_id: {key: '', value: 'None'},
    location_id: {key: '', value: 'None'},
    date: this.getFormatDate(new Date())
  };
  paramsFromServer: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App, public tickServ: TicketService, public toastCtrl: ToastController) {
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
    });
    pageModal.present();
  }

  onChange() {
    this.showedCalendar = !this.showedCalendar;
  }

  scan() {
    if (this.params.template_id.key && this.params.location_id.key) {
      this.navCtrl.push(TicketQrScannerPage, { params: this.params });
    }
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
