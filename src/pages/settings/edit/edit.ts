import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { EventsPage } from '../../../shared/classes/events-page';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage extends EventsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events,
              public alertCtrl: AlertController, public authSrv: AuthService, public translate: TranslateService) {
    super(events);
  }

  ionViewDidLoad() {
    console.log('Init EditPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  delAccount(user: User) {
    this.translate.get(['SETTINGS_PAGE.MESSAGES.DELETE_ACCOUNT', 'YES', 'NO']).subscribe(obj => {
      this.alertCtrl.create({
        title: obj['SETTINGS_PAGE.MESSAGES.DELETE_ACCOUNT'],
        mode: 'ios',
        buttons: [
          {
            text: obj['NO'],
            handler: () => console.log('No clicked')
          },
          {
            text: obj['YES'],
            handler: () => {
              this.authSrv.deleteUser(user);
            }
          }
        ]
      }).present();
    });
  }

}
