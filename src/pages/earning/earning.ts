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
    this.init();
  }

  async init() {
    // this.translate.get('LOADING_TEXT').subscribe(loadingText => {
    //   let loading = this.loadingCtrl.create({
    //     content: loadingText,
    //     spinner: 'dots'
    //   });

      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        spinner: 'dots'
      });

      loading.present();

      this.currenciesFromServer = await this.settingsServ.getCurrencies();

      Promise.all([
        this.eServ.getTotal(true),
        this.eServ.getMonthlyData(true),
        this.eServ.getQuarterlyData(true),
        this.eServ.getYearlyData(true),
      ]).then(
        result => {
          this.totalData = result[0];
          this.monthlyData = result[1];
          this.quarterlyData = result[2];
          this.yearlyData = result[3];
          loading.dismiss();
        },
        error => {
          loading.dismiss();
          console.log(error);
        }
      );

    // });
  }

  ionViewDidEnter() {
    this.content.scrollToTop();
  }

  goToTransaction(period: string): void {
    this.eServ.currentPeriod = period;
    this.events.publish('period:changed', period);
    this.navCtrl.parent.select(1);
  }

  changeCurrency() {
    let prompt = this.alertCtrl.create({
      title: 'Currency',
      message: 'Please choose currency for data to be displayed',
      inputs: this.currenciesFromServer.map(val => {
        return {
          type: 'radio',
          label: val,
          value: val,
          checked: this.currentCurrency == val
        }
      }),
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Choose',
          handler: data => {
            this.currentCurrency = data;
          }
        }
      ]
    });
    prompt.present();
  }

}
