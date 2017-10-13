import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { LandingPage } from '../landing/landing';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout() {
    this.app.getRootNav().setRoot(LandingPage);
  }

}
