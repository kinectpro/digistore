import { Component } from '@angular/core';
import { App, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';
import { LanguagePage } from './language/language';
import { TranslateService } from '@ngx-translate/core';
import { AccountPage } from './account/account';
import { StorageService } from '../../providers/storage-service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public authService: AuthService,
              public modalCtrl: ModalController, public translate: TranslateService, public alertCtrl: AlertController,
              public store: StorageService) {
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
    // this.oneSignal.enableSound(this.sound);
  }

  toggleNotify() {
    // this.oneSignal.setSubscription(this.notify);
  }

  changeLang() {
    this.modalCtrl.create(LanguagePage).present();
  }

  openAccountPage() {
    this.modalCtrl.create(AccountPage).present();
  }

}
