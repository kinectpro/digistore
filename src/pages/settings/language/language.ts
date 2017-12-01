import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../providers/auth-service';
import { EventsPage } from '../../../shared/classes/events-page';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage extends EventsPage {

  lang: string;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public translate: TranslateService, public authService: AuthService) {
    super(events);
    this.lang = this.translate.currentLang;
  }

  ionViewDidLoad() {
    console.log('Init LanguagePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeLang() {
    this.authService.lang = this.lang;
    this.translate.use(this.lang);
  }

}
