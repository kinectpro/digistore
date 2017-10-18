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

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
  }

}
