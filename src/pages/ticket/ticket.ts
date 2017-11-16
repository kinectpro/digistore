import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App, ToastController, Events } from 'ionic-angular';

import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';
import { TicketService } from '../../providers/ticket-service';
import { TicketParams } from '../../models/params';
import { TicketCheckPage } from './ticket-check/ticket-check';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  needDataUpdate: boolean = false;
  showedCalendar: boolean = false;
  options: CalendarComponentOptions = {
    monthFormat: 'MMMM YYYY',
    showMonthPicker: false
  };
  params: TicketParams = {
    template: this.tickServ.template,
    location: this.tickServ.location,
    date: this.getFormatDate(new Date())
  };
  paramsFromServer: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App,
              public tickServ: TicketService, public toastCtrl: ToastController, public events: Events, public translate: TranslateService) {

    this.events.subscribe('ticket-params:changed', params => this.params = params);
    this.events.subscribe('user:changed', () => this.needDataUpdate = true);

    this.translate.onLangChange.subscribe(() => {
      this.translate.get('SHORT_MONTHS').subscribe((val: string) => this.options.monthPickerFormat = val.split(','));
    });

    this.initTicketParams();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
    this.translate.get('SHORT_MONTHS').subscribe((val: string) => this.options.monthPickerFormat = val.split(','));
  }

  ionViewWillEnter() {
    if (this.needDataUpdate) {
      this.initTicketParams();
      this.params.template = { key: '', value: '' };
      this.params.location = { key: '', value: '' };
      this.needDataUpdate = false;
    }
  }

  initTicketParams() {
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
    }
    else {
      this.showNoParams();
    }
  }

  findWithoutNumber() {
    if (this.params.template.key && this.params.location.key)
      this.navCtrl.push(TicketCheckPage, { params: this.params, withoutNumber: true });
    else {
      this.showNoParams();
    }
  }

  showNoParams() {
    this.translate.get('E_TICKET_PAGE.NO_PARAMS').subscribe(mess => this.toastCtrl.create({
      message: mess,
      duration: 3000,
      position: 'bottom'
    }).present());
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
