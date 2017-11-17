import { Component } from '@angular/core';
import { App, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';

import { LandingPage } from '../landing/landing';
import { AuthService } from '../../providers/auth-service';
import { LanguagePage } from './language/language';
import { TranslateService } from '@ngx-translate/core';
import { AccountPage } from './account/account';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  _sound: boolean;
  _notify: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public authService: AuthService,
              public modalCtrl: ModalController, public translate: TranslateService, public oneSignal: OneSignal, public alertCtrl: AlertController) {
    this._sound = localStorage.getItem('sound') == null ? true : localStorage.getItem('sound') == 'Y';
    this._notify = localStorage.getItem('notify') == null ? true : localStorage.getItem('notify') == 'Y';
  }

  get sound(): boolean {
    return this._sound;
  }

  set sound(value: boolean) {
    localStorage.setItem('sound', value ? 'Y' : 'N');
    this._sound = value;
  }

  get notify(): boolean {
    return this._notify;
  }

  set notify(value: boolean) {
    localStorage.setItem('notify', value ? 'Y' : 'N');
    this._notify = value;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  async logout() {

    try {

      let message = await this.translate.get('SETTINGS_PAGE.MESSAGES.LOG_OUT').toPromise();
      let title = await this.translate.get('SETTINGS_PAGE.LOGOUT').toPromise();
      let cancel = await this.translate.get('CANCEL').toPromise();

      this.alertCtrl.create({
        title: title + '?',
        mode: 'ios',
        message: message,
        buttons: [
          {
            text: cancel,
            handler: () => console.log('Cancel clicked')
          },
          {
            text: title,
            cssClass: 'btn-logout',
            handler: () => {
              this.authService.logout();
              this.app.getRootNav().setRoot(LandingPage);
            }
          }
        ]
      }).present();

    } catch (err) {
      console.log(err);
    }

  }

  toggleSound() {
    this.oneSignal.enableSound(this.sound);
  }

  toggleNotify() {
    this.oneSignal.setSubscription(this.notify);
  }

  changeLang() {
    this.modalCtrl.create(LanguagePage).present();
  }

  openAccountPage() {
    this.modalCtrl.create(AccountPage).present();
  }

}
