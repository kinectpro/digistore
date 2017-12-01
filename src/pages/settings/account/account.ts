import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { EditPage } from '../edit/edit';
import { AddAccountPage } from '../add-account/add-account';
import { AuthService } from '../../../providers/auth-service';
import { User } from '../../../models/user';
import { EventsPage } from '../../../shared/classes/events-page';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage extends EventsPage {

  account: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public events: Events,
              public viewCtrl: ViewController, public modalCtrl: ModalController, public authSrv: AuthService) {
    super(events);
    this.account = authSrv.user.user_id;
  }

  ionViewDidLoad() {
    console.log('Init AccountPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    this.modalCtrl.create(EditPage).present();
  }

  delAccount(account: User): void {
    this.authSrv.deleteUser(account);
  }

  addAccount() {
    const modalPage = this.modalCtrl.create(AddAccountPage);
    modalPage.onDidDismiss(account => this.account = account);
    modalPage.present();
  }

}
