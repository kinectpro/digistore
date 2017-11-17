import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ReportResultPage } from '../report-result/report-result';
import { AuthService } from '../../../providers/auth-service';
import { Settings } from '../../../config/settings';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  private reportForm: FormGroup;
  affiliate: boolean = false;
  transaction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public http: HttpClient,
              public modalCtrl: ModalController, public auth: AuthService) {
    this.transaction = this.navParams.get('transaction');
    this.reportForm = fb.group({
      'description': ['', [
        Validators.required
      ]],
      'affiliate': [false]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  sendReport() {
    let affiliate = this.reportForm.get('affiliate').value ? 'buyer,affiliate' : 'buyer';
    this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/reportFraud?transaction_id=${this.transaction.transaction_id}&comment=${this.reportForm.get('description').value}&who=${affiliate}&language=en`).subscribe(
      (res: any) => {
          let ReportDetailsPageModal = this.modalCtrl.create(ReportResultPage, {
            status: res.result,
            message: res.result == 'error' ? res.message : res.data.buyer_message,
            order_id:this.transaction.order_id
          });
          ReportDetailsPageModal.onDidDismiss(res => {
          });
          ReportDetailsPageModal.present();
      },
      err => {
        console.log("Error: ", err);
      });
  }

}
