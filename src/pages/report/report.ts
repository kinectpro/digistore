import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  private reportForm: FormGroup;
  // affiliate: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder) {
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

}
