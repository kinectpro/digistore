import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-ticket-params',
  templateUrl: 'ticket-params.html',
})
export class TicketParamsPage {

  pageName: string;
  params: any;
  paramsFromServer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.pageName = navParams.get('pageName');
    this.params = navParams.get('params');
    this.paramsFromServer = navParams.get('paramsFromServer');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketParamsPage');
  }

  dismiss() {

    this.viewCtrl.dismiss({
      params: this.params
    });
  }


}
