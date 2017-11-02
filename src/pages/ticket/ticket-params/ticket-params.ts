import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-ticket-params',
  templateUrl: 'ticket-params.html',
})
export class TicketParamsPage {

  pageName: string;
  currentTemplate = 't2';
  templates = [
    {value: 't1'},
    {value: 't2'},
    {value: 't3'}
  ];
  templates2 = [
    {value: 'tt1'},
    {value: 'tt2'},
    {value: 'tt3'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.pageName = navParams.get('pageName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketParamsPage');
  }

  dismiss() {
    this.viewCtrl.dismiss({
      value: this.currentTemplate
    });
  }

}
