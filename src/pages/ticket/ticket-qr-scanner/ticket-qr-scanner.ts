import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { TicketScanPage } from '../ticket-scan/ticket-scan';
import { TicketParams } from '../../../models/params';

@Component({
  selector: 'page-ticket-qr-scanner',
  templateUrl: 'ticket-qr-scanner.html',
})
export class TicketQrScannerPage {

  params: TicketParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, public qrScanner: QRScanner, public viewCtrl: ViewController) {
    this.params = navParams.get('params');
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad TicketQrScannerPage');

    document.body.classList.add('hidden-tabbar');

    let stoppedTimer: boolean = false;

    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((code: string) => {

          stoppedTimer = true;
          this.params.eticket_id = code;
          this.navCtrl.push(TicketScanPage, { params: this.params });
          scanSub.unsubscribe();    // stop scanning
          this.qrScanner.destroy(); // hide camera preview
          this.viewCtrl.dismiss();  //drop page

        });

        // show camera preview
        this.qrScanner.show();

        setTimeout(() => {
          if (!stoppedTimer) this.cancel();
        }, 10000)
      }
      else if (status.denied) {
        console.log('status.denied');
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        this.cancel();
      }
    }).catch((e: any) => console.log('Error is', e));

  }

  ionViewWillLeave() {
    document.body.classList.remove('hidden-tabbar');
  }

  cancel() {
    this.qrScanner.destroy();
    this.navCtrl.pop();
  }

}
