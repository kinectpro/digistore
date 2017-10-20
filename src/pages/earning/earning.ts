import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TransactionsPage } from '../transactions/transactions';
import { EarningService } from '../../providers/earning-service';

@Component({
  selector: 'earning-home',
  templateUrl: 'earning.html'
})
export class EarningPage {
  segment: string = "total";
  toggle: string = 'gross';
  amount: number = 52307.04;
  monthes: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  quarters: string[] = ['January, February, March', 'April, May, June', 'July, August, September', 'October, November, December'];
  monthlyData: any[];
  quarterlyData: any[];
  yearlyData: any[];

  constructor(public navCtrl: NavController, public eServ: EarningService) {
    // this.someObject = this.eServ.getTotal();
    // this.monthlyData = this.eServ.getMonthlyData();
    this.quarterlyData = this.eServ.getQuarterlyData();
    this.yearlyData = this.eServ.getYearlyData();
  }

  goToTransaction(period: string): void {
    this.navCtrl.push(TransactionsPage, { period: period });
  }

}
