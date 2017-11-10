import { Component } from '@angular/core';
import { App, NavController, NavParams, ModalController } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { AuthService } from '../../providers/auth-service';
import { LanguagePage } from './language/language';
import { TranslateService } from '@ngx-translate/core';
import { AccountPage } from './account/account';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  sound: boolean = false;
  notify: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public authService: AuthService, public modalCtrl: ModalController, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout() {
    this.authService.logout();
    this.app.getRootNav().setRoot(LandingPage);
  }

  toggleSound() {
    console.log(this.sound);
  }

  toggleNotify() {
    console.log(this.notify);
  }

  changeLang() {
    this.modalCtrl.create(LanguagePage).present();
  }

  openAccountPage() {
    this.modalCtrl.create(AccountPage).present();
  }

}
