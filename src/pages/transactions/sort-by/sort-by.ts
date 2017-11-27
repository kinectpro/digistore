import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';

@Component({
  selector: 'page-sort-by',
  templateUrl: 'sort-by.html',
})
export class SortByPage {
  options: any[] = [
    { product_name: false },
    { earning: false },
    { date: false }
  ];
  sort: string;

  product_name:boolean = false;

  constructor(public viewCtrl: ViewController, public params: NavParams, public events: Events) {
    let sortObj = params.get('params_sort');
    this.sort = sortObj.sort_by + '-' + sortObj.sort_order;
  }

  ionViewDidLoad() {
    console.log('Init SortByPage');
  }

  ionViewDidEnter() {
    this.events.publish('modalState:changed', true);
  }

  ionViewWillLeave() {
    this.events.publish('modalState:changed', false);
  }

  dismiss() {
    this.viewCtrl.dismiss({
      params_changed: false
    });
  }

  submit() {
    let params_sort = this.sort.split('-');
    this.viewCtrl.dismiss({
      params_changed: true,
      params_sort: {
        sort_by: params_sort[0],
        sort_order: params_sort[1]
      }
    });
  }

  openOption(option: string) {
    for (let key in this.options) this.options[key] = false;
    this.options[option] = !this.options[option];
  }
}
