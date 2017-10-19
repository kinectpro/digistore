import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  private searchForm : FormGroup;
  extended: boolean = false;

  activeTab: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder) {
    this.searchForm = fb.group({
      'orderID': ['', [
        Validators.required
      ]]
    });
  }

  setActive(tab: string) {
    if (this.activeTab === tab) {
      this.activeTab = null;
    } else {
      this.activeTab = tab;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  switchType() {
    this.extended = !this.extended;
  }

}
