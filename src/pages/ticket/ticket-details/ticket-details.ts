import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { TicketCheckPage } from '../ticket-check/ticket-check';
import { TicketParams } from '../../../models/params';
import { TicketQrScannerPage } from '../ticket-qr-scanner/ticket-qr-scanner';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-ticket-details',
  templateUrl: 'ticket-details.html',
})
export class TicketDetailsPage {
  result: any;
  params: TicketParams;

  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public alertCtrl: AlertController, public transfer: FileTransfer, public file: File, public fileOpener: FileOpener) {
    this.result = navParams.get('result');
    this.params = navParams.get('params');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketDetailsPage');
  }

  redirect() {
    this.navCtrl.pop();
  }

  retry() {
    this.navCtrl.push(TicketQrScannerPage, { params: this.params });
  }

  checkWithNumber() {
    this.navCtrl.push(TicketCheckPage, { params: this.params });
  }

  downloadPdf() {
    const path: string = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(this.result.download_url, path + 'file.pdf').then((entry) => {
      this.fileOpener.open(entry.toURL(), 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));
    }, (error) => {
      console.log(error);
    });
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
