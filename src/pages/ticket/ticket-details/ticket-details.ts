import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TicketCheckPage } from '../ticket-check/ticket-check';

@Component({
  selector: 'page-ticket-details',
  templateUrl: 'ticket-details.html',
})
export class TicketDetailsPage {
  result: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.result = navParams.get('result');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketDetailsPage');
  }

  redirect() {
    this.navCtrl.pop();
  }

  retry() {

  }

  checkWithNumber() {
    this.navCtrl.push(TicketCheckPage);
  }

  markTicket(mark: boolean) {
    const message = 'The E-Ticket will be marked as ' +  (mark ? 'used': 'unused (and can be used again, if it is not blocked)');
    const prompt = this.alertCtrl.create({
      title: 'Mark as ' + (mark ? 'used?' : 'unused?'),
      mode: 'ios',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Mark',
          handler: () => {
            console.log('change mark');
          }
        }
      ]
    });
    prompt.present();
  }

}
