import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout() {
    this.authService.logout();
    this.app.getRootNav().setRoot(LandingPage);
  }

}
