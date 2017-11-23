import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Events, Content, AlertController } from 'ionic-angular';

import { EarningService } from '../../providers/earning-service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../providers/settings-service';
import { ErrorService } from '../../providers/error.service';

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
    this.translate.get('LOADING_TEXT').subscribe(loadingText => this.init(loadingText));

    events.subscribe('user:changed', () => this.needDataUpdate = true);
  }

  async init(loadingText: string) {

    this.somethingWentWrong = false;

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
      this.translate.get('LOADING_TEXT').subscribe(loadingText => this.init(loadingText));
      this.needDataUpdate = false;
    }
  }

  retry() {
    this.translate.get('LOADING_TEXT').subscribe(loadingText => this.init(loadingText));
  }

  goToTransaction(period: string): void {
    this.eServ.currentPeriod = period;
    this.events.publish('period:changed', period);
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

}
