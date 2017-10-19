import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

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

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
  }

}
