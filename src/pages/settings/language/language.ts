import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  lang: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public translate: TranslateService) {
    this.lang = this.translate.currentLang;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeLang() {
    this.translate.use(this.lang);
  }

}
