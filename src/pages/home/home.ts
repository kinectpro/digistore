import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { TransactionsPage } from '../transactions/transactions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  segment: string = "total";
  isAndroid: boolean = false;
  toggle: string = 'gross';
  amount: number = 52307.04;
  monthes: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  quarters: string[] = ['January, February, March', 'April, May, June', 'July, August, September', 'October, November, December'];
  quartersData: any[] = [
    {
      year: 2017,
      quarters: [423523, 23423.23, 3123.00, 1233.22]
    },
    {
      year: 2016,
      quarters: [423523, 23423.23, 3123.00, 1233.22]
    },
    {
      year: 2015,
      quarters: [423523, 23423.23, 3123.00, 1233.22]
    }
  ];

  constructor(platform: Platform, public navCtrl: NavController) {
    this.isAndroid = platform.is('android');
  }

  goToTransaction(period: string): void {
    this.navCtrl.push(TransactionsPage, { period: period });
  }

}
