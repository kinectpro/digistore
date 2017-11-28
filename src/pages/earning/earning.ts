import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Events, Content, AlertController, Refresher } from 'ionic-angular';

import { EarningService } from '../../providers/earning-service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../providers/settings-service';
import { ErrorService } from '../../providers/error-service';

@Component({
  selector: 'earning-home',
  templateUrl: 'earning.html'
})
export class EarningPage {
  needDataUpdate: boolean = false;
  somethingWentWrong: boolean = false;
  currenciesFromServer: string[];
  currentCurrency: string = 'EUR';
  segment: string = "total";
  toggle: string = 'brutto';
  monthlyData: {[key: string]: any};
  quarterlyData: {[key: string]: any};
  yearlyData: {[key: string]: any};
  totalData: {[key: string]: any};

  @ViewChild(Content)
  content: Content;

  constructor(public navCtrl: NavController, public eServ: EarningService, public loadingCtrl: LoadingController, public translate: TranslateService,
              public events: Events, public alertCtrl: AlertController, public settingsServ: SettingsService, public errSrv: ErrorService) {

    console.log('Init EarningPage');

    this.getData();

    events.subscribe('user:changed', () => this.needDataUpdate = true);
  }

  async init(loadingText: string) {

    let loading = this.loadingCtrl.create({
      content: loadingText,
      spinner: 'dots'
    });

    loading.present();

    try {

      this.currenciesFromServer = await this.settingsServ.getCurrencies();

      const result = await Promise.all([
        this.eServ.getTotal(true),
        this.eServ.getMonthlyData(true),
        this.eServ.getQuarterlyData(true),
        this.eServ.getYearlyData(true),
      ]);

      this.totalData = result[0];
      this.monthlyData = result[1];
      this.quarterlyData = result[2];
      this.yearlyData = result[3];

      this.somethingWentWrong = false;

      loading.dismiss();

    } catch (err) {
      this.somethingWentWrong = true;
      this.errSrv.showMessage(err);
      loading.dismiss();
    }
  }

  ionViewDidEnter() {
    this.content.scrollToTop();
  }

  ionViewWillEnter() {
    if (this.needDataUpdate) {
      this.getData();
      this.needDataUpdate = false;
    }
  }

  doRefresh(refresher: Refresher) {
    refresher.complete();
    this.getData();
  }

  getData() {
    this.translate.get('LOADING_TEXT').subscribe(loadingText => this.init(loadingText));
  }

  goToTransaction(period: string, timeInterval?: {[key: string]: any}): void {
    if (period) {
      this.eServ.currentPeriod = period;
      this.events.publish('period:changed', period);
    }
    else {
      if (timeInterval.month) {
        var from = this.getFormatData(timeInterval.year, timeInterval.month, 1);
        var to = this.getFormatData(timeInterval.year, timeInterval.month, this.getLastDayOfMonth(timeInterval.year, timeInterval.month));
      }
      else if (timeInterval.quarter) {
        var from = this.getDateFormat(new Date(timeInterval.year, timeInterval.quarter * 3 - 3, 1));
        var to = this.getDateFormat(new Date(timeInterval.year, timeInterval.quarter * 3, 0));
      }
      else {
        var from = this.getFormatData(timeInterval.year, 1, 1);
        var to = this.getFormatData(timeInterval.year, 12, 31);
      }
      this.eServ.range = [from, to];
      this.events.publish('range:changed', from, to);
    }
    this.navCtrl.parent.select(1);
  }

  changeCurrency() {

    this.translate.get(['GENERAL.CURRENCY', 'EARNINGS_PAGE.CURRENCY_DESCRIPTION', 'CANCEL', 'CHOOSE']).subscribe(obj => {
      this.alertCtrl.create({
        title: obj['GENERAL.CURRENCY'],
        // mode: 'ios',
        message: obj['EARNINGS_PAGE.CURRENCY_DESCRIPTION'],
        inputs: this.currenciesFromServer.map((val: any) => {
          return {
            type: 'radio',
            label: val.symbol + ' ' + val.name,
            value: val.code,
            checked: this.currentCurrency == val.code
          }
        }),
        buttons: [
          {
            text: obj['CANCEL'],
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: obj['CHOOSE'],
            handler: data => {
              this.currentCurrency = data;
            }
          }
        ]
      }).present();
    });

  }

  /**
   * The method returns the last day of the month
   * @param year
   * @param month
   * @returns {number}
   */
  getLastDayOfMonth(year: number, month: number): number {
    let date = new Date(year, month, 0);  // create a date from the next month, but the day isn't the first, but the "zero" (the previous one)
    return date.getDate();
  }

  /**
   * The method returns the date in the format YYYY-MM-DD
   * @param year
   * @param month
   * @param day
   * @returns {string}
   */
  getFormatData(year: number, month: number, day: number): string {
    let MM = month < 10 ? '0' + month : month;
    let DD = day < 10 ? '0' + day : day;

    return year + '-' + MM + '-' + DD;
  }

  /**
   * The method returns the date in the format YYYY-MM-DD
   * @param date
   * @returns {string}
   */
  getDateFormat(date: Date): string {

    let DD: any = date.getDate();
    if (DD < 10) DD = '0' + DD;

    let MM: any = date.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;

    let YYYY = date.getFullYear();

    return YYYY + '-' + MM + '-' + DD;
  }

}
