import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LandingPage } from '../landing/landing';
import { Http } from '@angular/http';
import { Settings } from '../../config/settings';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  pwdType: string = 'password';

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    // @todo change language "en" in the future
    this.http.get(Settings.BASE_URL + Settings.API_KEY + '/json/createApiKey?username=' + this.username + '&password=' + this.password + '&language=en').subscribe(
      res => {
        let response = res.json();
        if (response.result == 'error') {
          // @todo show alert message here
          alert("error:" + response.message);
        } else {
          // @todo save user details to local storage
          this.navCtrl.setRoot(TabsPage);
        }
    })
  }

  openBrowser(url: string) {
    this.iab.create(url, '_self', {location:'no'});
  }

  cancel() {
    this.navCtrl.setRoot(LandingPage);
  }

}
