import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LandingPage } from '../landing/landing';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  pwdType: string = 'password';

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    this.navCtrl.setRoot(TabsPage);
  }

  openBrowser(url: string) {
    this.iab.create(url, '_self', {location:'no'});
  }

  cancel() {
    this.navCtrl.setRoot(LandingPage);
  }

}
