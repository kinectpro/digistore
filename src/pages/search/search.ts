import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Search } from '../../models/params';
import { ParamsPage } from '../params/params';
import { SettingsService } from '../../providers/settings-service';
import { TranslateService } from '@ngx-translate/core';
import { CompleteService } from '../../providers/complete-service';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

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

  constructor(public navParams: NavParams, public fb: FormBuilder, public viewCtrl: ViewController, public modalCtrl: ModalController,
              public settingsServ: SettingsService, public loadingCtrl: LoadingController, public translate: TranslateService, public complServ: CompleteService) {

    this.searchObj = navParams.get('params_search');
    console.log('-------------search parameters is there-----------------');
    console.log(this.searchObj);

    this.searchForm = fb.group({
      'purchase_id': [this.searchObj.purchase_id, [Validators.required]]
    });

    this.searchFormExtended = fb.group({
      'purchase_id': [this.searchObj.purchase_id],
      'product_id': [this.searchObj.product_id],
      'first_name': [this.searchObj.first_name],
      'last_name': [this.searchObj.last_name],
      'email': [this.searchObj.email],
      //'from': [this.searchObj.from],
      //'to': [this.searchObj.to]
    });

    this.translate.get('LOADING_TEXT').subscribe(loadingText => {
      let loading = this.loadingCtrl.create({
        content: loadingText,
        spinner: 'dots'
      });

      loading.present();

      Promise.all([
        this.settingsServ.getGlobalSettings(),
        this.settingsServ.getCurrencies(),
      ]).then(
        result => {
          this.globalTypesFromServer = result[0];
          this.currenciesFromServer = result[1];
          loading.dismiss();
        },
        error => {
          loading.dismiss();
          console.log(error);
        }
      );
    });

    this.payments = this.searchObj.pay_method ? this.searchObj.pay_method.split(',') : [];
    this.currencies = this.searchObj.currency ? this.searchObj.currency.split(',') : [];
  }

  setActive(tab: string) {
    this.activeTab = this.activeTab === tab ? null : tab;
  }

  ionViewDidLoad() {
    console.log('Init SearchPage');
  }

  switchType() {
    this.extended = !this.extended;
  }

  clearSearchParams() {
    this.searchFormExtended.reset();
    for (let key in this.searchObj) this.searchObj[key] = '';
    this.payments = [];
    this.currencies = [];
  }

  getAffiliateValue(): string {
    if (this.searchObj.has_affiliate == 'Y') return 'With Affiliate';
    if (this.searchObj.has_affiliate == 'N') return 'Without Affiliate';
    if (this.searchObj.affiliate_name) return this.searchObj.affiliate_name;
    return 'All';
  }

  getTypesValue(value: string): string {
    if (!value) return 'Any';
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
    const pageModal = this.modalCtrl.create(ParamsPage, { pageName: pageName, search: this.searchObj, globalTypesFromServer: this.globalTypesFromServer });
    pageModal.onDidDismiss(res => {
      console.log('ПРИШЛИ ПАРАММЕТРЫ ИЗ ParamsPage');
      console.log(res.search);
      this.searchObj = res.search;
      console.log('ТЕПЕРЬ ТАК ВЫГЛЯДИТ searchObj');
      console.log(this.searchObj);
    });
    pageModal.present();
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
        this.showError('At least one symbol should be entered');
        return;
      }
      this.searchObj.purchase_id = this.searchForm.get('purchase_id').value;
    }
    else {
      this.searchObj.purchase_id = this.searchFormExtended.get('purchase_id').value;
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
    console.log(this.searchbar.getValue());
    this.searchFormExtended.get('product_id').setValue(e.id);
  }

}
