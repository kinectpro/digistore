import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { Search } from '../../../models/params';
import { SettingsService } from '../../../providers/settings-service';
import { TranslateService } from '@ngx-translate/core';
import { EventsPage } from '../../../shared/classes/events-page';

@Component({
  selector: 'page-params',
  templateUrl: 'params.html',
})
export class ParamsPage extends EventsPage {

  pageName: string;
  search: Search;
  // variables for affiliatePage
  affiliate: string;
  affiliateName: string;
  showedInputAffiliateName: boolean;
  // variables for transactionTypePage and billingTypePage
  types: any[] = [];
  anyValue: boolean;
  private field: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public settingsServ: SettingsService, public events: Events, public translate: TranslateService) {
    super(events);
    this.pageName = navParams.get('pageName');
    this.search = navParams.get('search');
    const globalTypesFromServer = navParams.get('globalTypesFromServer');

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
      this.field = this.pageName.toLowerCase().replace(' ', '_');
      let values = this.search[this.field] ? this.search[this.field].split(',') : [];
      this.anyValue = !values.length;
      for (let key in globalTypesFromServer['search_' + this.field]) {
        this.types.push({
          key: key,
          name: globalTypesFromServer['search_' + this.field][key],
          value: !!values.find(obj => obj === key)
        });
      }
    }
  }

  ionViewDidLoad() {
    console.log('Init ParamsPage');
  }

  ionViewWillLeave() {
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
      this.search[this.field] = this.getSearchParams();
    }

    this.events.publish('transactions-params:changed', this.search);
    super.ionViewWillLeave();
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
    this.viewCtrl.dismiss();
  }

  getSearchParams(): string {
    let res: string = '';
    this.types.forEach(obj => {
      if (obj.value)  {
        res += (res ? ',' : '') + obj.key;
      }
    });
    return res;
  }

}
