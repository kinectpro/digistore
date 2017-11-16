import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Events, Content, AlertController } from 'ionic-angular';

import { EarningService } from '../../providers/earning-service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../providers/settings-service';

@Component({
  selector: 'earning-home',
  templateUrl: 'earning.html'
})
export class EarningPage {
  needDataUpdate: boolean = false;
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
              public events: Events, public alertCtrl: AlertController, public settingsServ: SettingsService) {

    console.log('Init EarningPage');
    this.translate.get('LOADING_TEXT').subscribe(loadingText => this.init(loadingText));

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

      loading.dismiss();

    } catch (err) {
      console.log(err);
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

  goToTransaction(period: string): void {
    this.eServ.currentPeriod = period;
    this.events.publish('period:changed', period);
    this.navCtrl.parent.select(1);
  }

  changeCurrency() {
    this.translate.get('GENERAL.CURRENCY').subscribe((title: string) => {
      this.translate.get('EARNINGS_PAGE.CURRENCY_DESCRIPTION').subscribe((msg: string) => {
        this.translate.get('CANCEL').subscribe((cancel: string) => {
          this.translate.get('CHOOSE').subscribe((choose: string) => {
            let prompt = this.alertCtrl.create({
              title: title,
              // mode: 'ios',
              message: msg,
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
                  text: cancel,
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: choose,
                  handler: data => {
                    this.currentCurrency = data;
                  }
                }
              ]
            });
            prompt.present();
          });
        });
      });
    });
  }

}
