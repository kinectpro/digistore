import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Settings } from '../../config/settings';
import { HttpClient } from '@angular/common/http';
import { ReportResultPage } from '../report-result/report-result';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  private reportForm: FormGroup;
  // affiliate: boolean = false;
  transaction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public http: HttpClient,
              public modalCtrl: ModalController) {
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
    this.http.get(Settings.BASE_URL + Settings.API_KEY + '/json/reportFraud?transaction_id=' + this.transaction.transaction_id + '&comment=' + this.reportForm.get('description').value + '&language=en').subscribe(
      (res: any) => {
          let ReportDetailsPageModal = this.modalCtrl.create(ReportResultPage, { status: res.result, message: res.message });
          ReportDetailsPageModal.onDidDismiss(res => {
          });
          ReportDetailsPageModal.present();
      },
      err => {
        console.log("Error: ", err);
      })
  }

}
