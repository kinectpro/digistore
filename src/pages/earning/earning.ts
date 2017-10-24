import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TransactionsPage } from '../transactions/transactions';
import { EarningService } from '../../providers/earning-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'earning-home',
  templateUrl: 'earning.html'
})
export class EarningPage {
  segment: string = "total";
  toggle: string = 'brutto';
  monthlyData: any[];
  quarterlyData: any[];
  yearlyData: any[];
  totalData: any;

  constructor(public navCtrl: NavController, public eServ: EarningService, public loadingCtrl: LoadingController, public translate: TranslateService) {

    console.log('Init EarningPage');

    this.translate.get('LOADING_TEXT').subscribe(loadingText => {
      let loading = this.loadingCtrl.create({
        content: loadingText,
        spinner: 'dots'
      });

      loading.present();

      Promise.all([
        this.eServ.getTotal(true),
        this.eServ.getMonthlyData(true),
        this.eServ.getQuarterlyData(true),
        this.eServ.getYearlyData(true)
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
    });


    // this.eServ.getTotal().then(
    //   res => this.totalData = res,
    //   err => console.log(err)
    // );
    // this.eServ.getMonthlyData().then(
    //   res => this.monthlyData = res,
    //   err => console.log(err)
    // );
    // this.eServ.getQuarterlyData().then(
    //   res => this.quarterlyData = res,
    //   err => console.log(err)
    // );
    // this.eServ.getYearlyData().then(
    //   res => this.yearlyData = res,
    //   err => console.log(err)
    // );
  }

  goToTransaction(period: string): void {
    this.navCtrl.push(TransactionsPage, { period: period });
  }


}
