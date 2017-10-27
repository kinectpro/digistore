import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Search } from '../../models/params';
import { SettingsService } from '../../providers/settings-service';

@Component({
  selector: 'page-params',
  templateUrl: 'params.html',
})
export class ParamsPage {

  pageName: string;
  search: Search;
  // variables for affiliatePage
  affiliate: string;
  affiliateName: string;
  showedInputAffiliateName: boolean;
  // variables for transactionTypePage and billingTypePage
  types: any[] = [];
  anyValue: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public settingsServ: SettingsService) {
    this.pageName = navParams.get('pageName');
    this.search = navParams.get('search');
    const globalTypesFromServer = navParams.get('globalTypesFromServer');
    console.log('ПРИШЛИ ПАРАММЕТРЫ В ParamsPage');
    console.log(this.search);

    if (this.pageName == 'Affiliate') {
      if (this.search.has_affiliate) {
        this.affiliate = this.search.has_affiliate;
      }
      else if (this.search.affiliate_name) {
        this.affiliate = 'name';
        this.affiliateName = this.search.affiliate_name;
      }
      else {
        this.affiliate = '';
      }
    }

    if (this.pageName == 'Transaction type' || this.pageName == 'Billing type') {
      const field = this.pageName.toLowerCase().replace(' ', '_');
      let values = this.search[field] ? this.search[field].split(',') : [];
      this.anyValue = !values.length;
      for (let key in globalTypesFromServer['search_' + field]) {
        this.types.push({
          key: key,
          name: globalTypesFromServer['search_' + field][key],
          value: !!values.find(obj => obj === key)
        });
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParamsPage');
  }

  showInputAffiliateName(flag: boolean) {
    if (!flag) {
      this.affiliateName = undefined;
    }
    this.showedInputAffiliateName = flag;
  }

  clearCheckboxesTypes() {
    if (this.anyValue) {
      this.types.forEach(obj => obj.value = false);
    }
  }

  clearCheckboxAny(flag: boolean) {
    if (flag) this.anyValue = false;
  }


  dismiss() {
    // Affiliate Page
    if (this.pageName == 'Affiliate') {
      if (this.affiliate == 'name') {
        console.log('this.affiliate == name');
        this.search.affiliate_name = this.affiliateName;
        this.search.has_affiliate = '';
      }
      else {
        console.log('this.affiliate !== name');
        this.search.has_affiliate = this.affiliate;
        this.search.affiliate_name = '';
      }
    }
    // Transaction Type Page or Billing Type Page
    if (this.pageName == 'Transaction type' || this.pageName == 'Billing type') {
      const field = this.pageName.toLowerCase().replace(' ', '_');
      this.search[field] = '';
      this.types.forEach(obj => {
        if (obj.value)  {
          this.search[field] += (this.search[field] ? ',' : '') + obj.key;
        }
      });
    }

    this.viewCtrl.dismiss({
      search: this.search
    });
  }

}
