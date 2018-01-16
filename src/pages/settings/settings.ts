import { Component } from '@angular/core';
import { App, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';

import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';
import { LanguagePage } from './language/language';
import { TranslateService } from '@ngx-translate/core';
import { AccountPage } from './account/account';
import 'rxjs/add/operator/toPromise';
import { PushwooshService } from '../../providers/pushwoosh-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  _sound: boolean;
  _notify: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public authService: AuthService,
              public modalCtrl: ModalController, public translate: TranslateService, public oneSignal: OneSignal, public alertCtrl: AlertController,
              public pushwooshService: PushwooshService) {
    this._sound = localStorage.getItem('sound') == null ? true : localStorage.getItem('sound') == 'Y';
    this._notify = localStorage.getItem('notify') == null ? true : localStorage.getItem('notify') == 'Y';
  }

  get sound(): boolean {
    return this._sound;
  }

  set sound(value: boolean) {
    localStorage.setItem('sound', value ? 'Y' : 'N');
    this.pushwooshService.sendPushToken(false);
    this._sound = value;
  }

  get notify(): boolean {
    return this._notify;
  }

  set notify(value: boolean) {
    localStorage.setItem('notify', value ? 'Y' : 'N');
    this.pushwooshService.sendPushToken(false);
    this._notify = value;
  }

  ionViewDidLoad() {
    console.log('Init SettingsPage');
  }

  logout() {
    this.translate.get(['SETTINGS_PAGE.MESSAGES.LOG_OUT', 'SETTINGS_PAGE.LOGOUT', 'CANCEL', 'SETTINGS_PAGE.LOGOUT_POPUP.TITLE', 'SETTINGS_PAGE.LOGOUT_POPUP.EXIT']).subscribe(obj => {
      this.alertCtrl.create({
        title: obj['SETTINGS_PAGE.LOGOUT_POPUP.TITLE'] + '?',
        mode: 'md',
        message: obj['SETTINGS_PAGE.MESSAGES.LOG_OUT'],
        buttons: [
          {
            text: obj['CANCEL'],
            handler: () => console.log('Cancel clicked')
          },
          {
            text: obj['SETTINGS_PAGE.LOGOUT_POPUP.EXIT'],
            cssClass: 'btn-logout',
            handler: () => {
              this.authService.logout();
              this.app.getRootNav().setRoot(LoginPage);
            }
          }
        ]
      }).present();
    });
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
