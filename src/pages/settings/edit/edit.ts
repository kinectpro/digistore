import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public alertCtrl: AlertController, public authSrv: AuthService, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  // done() {
  //   console.log('Done');
  // }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async delAccount(user: User) {

    try {

      let title = await this.translate.get('SETTINGS_PAGE.MESSAGES.DELETE_ACCOUNT').toPromise();
      let yes = await this.translate.get('YES').toPromise();
      let no = await this.translate.get('NO').toPromise();

      this.alertCtrl.create({
        title: title,
        mode: 'ios',
        buttons: [
          {
            text: no,
            handler: () => console.log('No clicked')
          },
          {
            text: yes,
            handler: () => {
              this.authSrv.deleteUser(user);
            }
          }
        ]
      }).present();

    } catch (err) {
      console.log(err);
    }
  }

}
