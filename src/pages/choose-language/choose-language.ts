import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-choose-language',
  templateUrl: 'choose-language.html',
})
export class ChooseLanguagePage {

  lang: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public authSrv: AuthService) {
    this.lang = translate.currentLang;
  }

  ionViewDidLoad() {
    console.log('Init ChooseLanguagePage');
  }

  openLoginPage() {
    this.authSrv.lang = this.lang;
    this.navCtrl.push(LoginPage);
  }

  chooseLang(lang: string) {
    this.lang = lang;
    this.translate.use(this.lang);
  }

}
