import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { EditPage } from '../edit/edit';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  account: string = 'lars';

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public viewCtrl: ViewController, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    this.modalCtrl.create(EditPage).present();
  }

  delAccount(account: any): void {
    console.log(account);
  }

  changeAccount() {
    console.log(this.account);
  }

  addAccount() {

  }

}
