import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, App } from 'ionic-angular';
import { TicketCheckPage } from '../ticket-check/ticket-check';
import { TicketParams } from '../../../models/params';
import { TicketQrScannerPage } from '../ticket-qr-scanner/ticket-qr-scanner';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { TicketService } from '../../../providers/ticket-service';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-ticket-details',
  templateUrl: 'ticket-details.html',
})
export class TicketDetailsPage {
  result: any;
  params: TicketParams;

  constructor(public navCtrl: NavController, public fileOpener: FileOpener, public platform: Platform, public alertCtrl: AlertController, public translate: TranslateService,
              public transfer: FileTransfer, public viewCtrl: ViewController, public ticketSrv: TicketService, public navParams: NavParams, public file: File, public app: App) {
    this.result = navParams.get('result');
    this.params = navParams.get('params');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketDetailsPage');
  }

  back() {
    this.navCtrl.pop();
  }

  done() {
    if (!this.result.nav)
      this.back();
    else {
      this.result.nav.parent.select(2);
      this.viewCtrl.dismiss();
    }
  }

  retry() {
    this.navCtrl.push(TicketQrScannerPage, { params: this.params });
    this.viewCtrl.dismiss();
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

  async markTicket() {

    let message = await this.translate.get('E_TICKET_PAGE.POPUP_MARK_AS_USED_TEXT').toPromise();
    let title = await this.translate.get('E_TICKET_PAGE.POPUP_MARK_AS_USED_TITLE').toPromise();
    let cancel = await this.translate.get('CANCEL').toPromise();
    let mark = await this.translate.get('E_TICKET_PAGE.MARK').toPromise();

    const prompt = this.alertCtrl.create({
      title: title,
      mode: 'ios',
      message: message,
      buttons: [
        {
          text: cancel,
          handler: () => console.log('Cancel clicked')
        },
        {
          text: mark,
          handler: () => {
            this.params.ticket = this.result.id;
            this.ticketSrv.validateTicket(this.params).then(
              res => {
                res.nav = this.result.nav;  // pass parent nav
                this.navCtrl.push(TicketDetailsPage, { params: this.params, result: res }).then( () => this.viewCtrl.dismiss() );
              },
              err => {
                this.navCtrl.push(TicketDetailsPage, {
                  params: this.params,
                  result: {
                    status: 'failure',
                    msg: err
                  }
                }).then( () => this.viewCtrl.dismiss() );
              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

}
