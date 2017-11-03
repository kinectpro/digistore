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
    if (this.pageName == 'E-Ticket template') {
      this.params.template.value = this.findValueInObjByKey(this.paramsFromServer.templates, this.params.template.key);
    } else {
      this.params.location.value = this.findValueInObjByKey(this.paramsFromServer.locations, this.params.location.key);
    }
    this.viewCtrl.dismiss({
      params: this.params
    });
  }

  findValueInObjByKey(obj: any, key: string): string {
    let sumObj = {};
    for (var prop in obj) {
      sumObj = Object.assign(sumObj, obj[prop]);
    }
    return sumObj[key];
  }

}
