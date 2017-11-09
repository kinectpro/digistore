import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
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

  delAccount() {
    this.alertCtrl.create({
      title: 'Delete account?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          handler: () => console.log('No clicked')
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
          }
        }
      ]
    }).present();
  }

}
