import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-sort-by',
  templateUrl: 'sort-by.html',
})
export class SortByPage {
  period: string;
  options: any[] = [
    { product_name: false },
    { earning: false },
    { date: false }
  ];

  product_name:boolean = false;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.period = params.get('period');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submit() {
    this.viewCtrl.dismiss();
  }

  openOption(option: string) {
    this.options[option]= !this.options[option];
  }
}
