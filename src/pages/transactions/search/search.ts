import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, ModalController, LoadingController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ParamsPage } from '../params/params';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { Search } from '../../../models/params';
import { SettingsService } from '../../../providers/settings-service';
import { CompleteService } from '../../../providers/complete-service';
import { ErrorService } from '../../../providers/error.service';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  private searchForm : FormGroup;
  private searchFormExtended : FormGroup;
  private showedError: string = '';
  private payments: string[];
  private currencies: string[];
  searchObj: Search;
  globalTypesFromServer: any;
  currenciesFromServer: string[];
  extended: boolean = false;

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  activeTab: string;

  constructor(public navParams: NavParams, public fb: FormBuilder, public viewCtrl: ViewController, public modalCtrl: ModalController, public events: Events, public errSrv: ErrorService,
              public settingsServ: SettingsService, public loadingCtrl: LoadingController, public translate: TranslateService, public complServ: CompleteService) {

    this.searchObj = navParams.get('params_search');

    this.searchForm = fb.group({
      'purchase_id': [this.searchObj.purchase_id, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[A-Za-z])[0-9A-Za-z]+')  // ?=  -  Continues the search only if to the right of the current position in the text is the bracketed expression.
      ]]
    });

    this.searchFormExtended = fb.group({
      //'purchase_id': [this.searchObj.purchase_id],
      'product_id': [this.searchObj.product_id],
      'first_name': [this.searchObj.first_name],
      'last_name': [this.searchObj.last_name],
      'email': [this.searchObj.email, Validators.pattern("[a-zA-Z_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}")],
      //'from': [this.searchObj.from],
      //'to': [this.searchObj.to]
    });

    this.currenciesFromServer = this.settingsServ.currencies;

    this.settingsServ.getGlobalSettings().then(
      res => this.globalTypesFromServer = res,
      err => this.errSrv.showMessage(err)
    );

    this.payments = this.searchObj.pay_method ? this.searchObj.pay_method.split(',') : [];
    this.currencies = this.searchObj.currency ? this.searchObj.currency.split(',') : [];

    this.events.subscribe('transactions-params:changed', params => this.searchObj = params);
  }

  setActive(tab: string) {
    this.activeTab = this.activeTab === tab ? null : tab;
  }

  ionViewDidLoad() {
    console.log('Init SearchPage');
    this.searchbar.setValue(this.searchObj.product_name);
  }

  switchType() {
    this.extended = !this.extended;
  }

  clearSearchParams() {
    this.searchFormExtended.reset();
    for (let key in this.searchObj) this.searchObj[key] = '';
    this.searchbar.setValue('');
    this.payments = [];
    this.currencies = [];
  }

  getAffiliateValue(): string {
    let with_affiliate, without_affiliate, all :string = '';
    this.translate.get(['SEARCH_FILTERS_PAGE.WITH_AFFILIATE', 'SEARCH_FILTERS_PAGE.WITHOUT_AFFILIATE', 'ALL']).subscribe( obj => {
      with_affiliate = obj['SEARCH_FILTERS_PAGE.WITH_AFFILIATE'];
      without_affiliate = obj['SEARCH_FILTERS_PAGE.WITHOUT_AFFILIATE'];
      all = obj['ALL'];
    });

    if (this.searchObj.has_affiliate == 'Y') return with_affiliate;
    if (this.searchObj.has_affiliate == 'N') return without_affiliate;
    if (this.searchObj.affiliate_name) return this.searchObj.affiliate_name;
    return all;
  }

  getTypesValue(value: string): string {
    let any: string = '';
    this.translate.get('ANY').subscribe(val => any = val);
    if (!value) return any;
    return value.split(',').map(obj => (obj[0].toUpperCase() + obj.slice(1)).replace('_', ' ')).join(', ');
  }

  toggleVal(collection: string, value: string, el: any) {
    let htmlEl = el._elementRef.nativeElement;
    htmlEl.classList.toggle('selected');
    if (htmlEl.classList.contains('selected')) {
      this[collection].push(value);
    }
    else {
      this[collection] = this[collection].filter(obj => obj != value);
    }
  }

  setSelectedClass(collection: any, value: string): boolean {
    return !!collection.find(obj => obj == value);
  }

  openPageParams(pageName: string) {
    this.modalCtrl.create(ParamsPage, {
      pageName: pageName,
      search: this.searchObj,
      globalTypesFromServer: this.globalTypesFromServer
    }).present();
  }

  dismiss() {
    this.viewCtrl.dismiss({ params_changed: false });
  }

  showError(mess: string) {
    this.showedError = mess;
    setTimeout(() => {
      this.showedError = '';
    }, 3000);
  }

  submit() {

    if (!this.extended) {
      if (!this.searchForm.valid) {
        let err = this.searchForm.get('purchase_id').errors;
        if (err.required) {
          this.translate.get('SEARCH_FILTERS_PAGE.AT_LEAST_SYMBOL').subscribe(val => this.showError(val));
          return;
        }
        if (err.minlength) {
          this.translate.get('SEARCH_FILTERS_PAGE.MIN_LENGTH').subscribe(val => this.showError(`${val} ${err.minlength.requiredLength}`));
          return;
        }
        if (err.pattern) {
          this.translate.get('SEARCH_FILTERS_PAGE.PATTERN').subscribe(val => this.showError(val));
          return;
        }
      }
      this.searchObj.purchase_id = this.searchForm.get('purchase_id').value;
    }
    else {
      if (this.searchFormExtended.get('email').value && this.searchFormExtended.get('email').invalid) {
        this.activeTab = 'customer';
        return;
      }
      //this.searchObj.purchase_id = this.searchFormExtended.get('purchase_id').value;
      this.searchObj.product_id = this.searchFormExtended.get('product_id').value;
      this.searchObj.first_name = this.searchFormExtended.get('first_name').value;
      this.searchObj.last_name = this.searchFormExtended.get('last_name').value;
      this.searchObj.email = this.searchFormExtended.get('email').value;
      //this.searchObj.from = this.searchFormExtended.get('from').value;
      //this.searchObj.to = this.searchFormExtended.get('to').value;
      this.searchObj.pay_method = this.payments.join(',');
      this.searchObj.currency = this.currencies.join(',');
    }

    this.viewCtrl.dismiss({
      params_changed: true,
      params_search: this.searchObj
    });
  }

  selectedProduct(e: any) {
    this.searchObj.product_name = this.searchbar.getValue();
    this.searchFormExtended.get('product_id').setValue(e.id);
  }

  clearProduct() {
    this.searchbar.setValue('');
    this.searchFormExtended.get('product_id').reset();
  }

}
