import { Component, ViewChild, Inject } from '@angular/core';
import { NavParams, ViewController, ModalController, LoadingController, Events, Content } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard';

import { ParamsPage } from '../params/params';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { Search } from '../../../models/params';
import { SettingsService } from '../../../providers/settings-service';
import { CompleteService } from '../../../providers/complete-service';
import { ErrorService } from '../../../providers/error-service';
import { EventsPage } from '../../../shared/classes/events-page';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage extends EventsPage {
  private searchForm : FormGroup;
  private searchFormExtended : FormGroup;
  private showedError: string = '';
  private payments: string[];
  private currencies: string[];
  private _searchObj: Search;
  get searchObj(): Search {
    return this._searchObj;
  }
  set searchObj(value: Search) {
    this._searchObj = value;
    this.recount(this._searchObj);
  }
  globalTypesFromServer: any;
  currenciesFromServer: string[];
  extended: string = 'N';
  months: any = {
    'en': ["January","February","March","April","May","June","July","August","September","October","November","December"],
    'de': ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]
  };
  curLang: string = 'en';
  maxYear: number = new Date().getFullYear() + 5;
  counters: any = {
    product: 0,
    customer: 0,
    transaction: 0
  };

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  @ViewChild(Content)
  content: Content;

  activeTab: string;
  private logoHidden: boolean = false;
  private showTransparentDiv: boolean = false;
  keyboardHideSubscription: Subscription;
  searchFormExtendedSubscription: Subscription;

  constructor(public navParams: NavParams, public fb: FormBuilder, public viewCtrl: ViewController, public modalCtrl: ModalController, public events: Events, public errSrv: ErrorService, public keyboard: Keyboard,
              public settingsServ: SettingsService, public loadingCtrl: LoadingController, public translate: TranslateService, public complServ: CompleteService, @Inject(DOCUMENT) private document: any) {

    super(events);

    this.searchObj = navParams.get('params_search');

    this.searchForm = fb.group({
      'purchase_id': [this.searchObj.purchase_id, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[A-Za-z])[0-9A-Za-z]+')  // ?=  -  Continues the search only if to the right of the current position in the text is the bracketed expression.
      ]]
    });

    this.searchFormExtended = fb.group({
      'product_id': [this.searchObj.product_id || ''],
      'first_name': [this.searchObj.first_name || ''],
      'last_name': [this.searchObj.last_name || ''],
      'email': [this.searchObj.email || '', Validators.pattern("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")],
    });

    this.currenciesFromServer = this.settingsServ.currencies;

    this.settingsServ.getGlobalSettings().then(
      res => this.globalTypesFromServer = res,
      err => this.errSrv.showMessage(err)
    );

    this.payments = this.searchObj.pay_method ? this.searchObj.pay_method.split(',') : [];
    this.currencies = this.searchObj.currency ? this.searchObj.currency.split(',') : [];

    this.events.subscribe('transactions-params:changed', params => this.searchObj = params);
    this.searchFormExtendedSubscription = this.searchFormExtended.valueChanges.subscribe( valuesObj => {
      if (this.searchFormExtended.valid) {
        Object.keys(valuesObj).map(key => this.searchObj[key] = valuesObj[key].trim());
        this.counters.product = 0;
        this.counters.customer = 0;
        this.recount(valuesObj, false);
      }
    });
  }

  get product_id(): AbstractControl {
    return this.searchFormExtended.get('product_id');
  }
  get first_name(): AbstractControl {
    return this.searchFormExtended.get('first_name');
  }
  get last_name(): AbstractControl {
    return this.searchFormExtended.get('last_name');
  }
  get email(): AbstractControl {
    return this.searchFormExtended.get('email');
  }

  ionViewDidLoad() {
    console.log('Init SearchPage');
    this.searchbar.setValue(this._searchObj.product_name);
    this.keyboardHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.logoHidden = false);
    this.curLang = this.translate.currentLang;
  }

  setActive(tab: string) {
    this.activeTab = this.activeTab === tab ? null : tab;
  }

  clearSearchParams() {
    this.searchFormExtended.reset({ product_id: '', first_name: '', last_name: '', email: ''});
    for (let key in this.searchObj) this.searchObj[key] = '';
    this.searchbar.setValue('');
    this.payments = [];
    this.currencies = [];
    this.counters = {
      product: 0,
      customer: 0,
      transaction: 0
    };
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

  getTypesValue(value: string, field: string): string {
    let any: string = '';
    this.translate.get('ANY').subscribe(val => any = val);
    if (!value) return any;
    return value.split(',').map(el => this.globalTypesFromServer[field][el]).map(el => el[0].toUpperCase() + el.slice(1)).join(', ');
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
    this.searchObj[collection == 'currencies' ? 'currency' : 'pay_method'] = this[collection].join(',');
    this.recount(this.searchObj);
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

    if (this.extended == 'N') {
      if (!this.searchForm.valid) {
        let err = this.searchForm.get('purchase_id').errors;
        if (err.required) {
          this.translate.get('SEARCH_FILTERS_PAGE.AT_LEAST_SYMBOL').subscribe(val => this.showError(val));
          return;
        }
        if (err.minlength) {
          this.translate.get('SEARCH_FILTERS_PAGE.MIN_LENGTH', { value: err.minlength.requiredLength }).subscribe(val => this.showError(`${val}`));
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
      if (this.email.value && this.email.invalid) {
        this.activeTab = 'customer';
        return;
      }
    }

    this.viewCtrl.dismiss({
      params_changed: true,
      params_search: this.searchObj
    }, this.extended);
  }

  selectedProduct(e: any) {
    this.searchObj.product_name = this.searchbar.getValue();
    this.product_id.setValue(e.id);
  }

  clearProduct() {
    this.searchbar.setValue('');
    this.product_id.reset('');
    this.searchbar.suggestions = [];
  }

  blurProduct() {
    this.showTransparentDiv = false;
    if (!this.product_id.value && this.searchbar.suggestions[0]) {
      this.searchbar.setValue(this.searchbar.suggestions[0]['name']);
      this.product_id.setValue(this.searchbar.suggestions[0]['id']);
    }
  }

  onFocused(id: string) {
    if (id == 'product-name') {
      this.showTransparentDiv = true;
    }
    this.logoHidden = true;
    this.content.scrollTo(0, this.document.getElementById(id).offsetTop - 5);
  }

  onKeydown(e: any) {
    if (e.keyCode == 13) {
      e.preventDefault();
      if (this.extended == 'N')
        this.submit();
      else {
        this.keyboard.close();
      }
    }
  }

  dateChanged() {
    this.recount(this.searchObj);
  }

  private recount(obj: any, resetCounters: boolean = true) {
    if (resetCounters) {
      this.counters = {
        product: 0,
        customer: 0,
        transaction: 0
      };
    }
    for (let key in obj) {
      if (!obj[key]) continue;
      switch (key) {
        case 'product_id': {
          this.counters.product++;
          break;
        }
        case 'first_name':
        case 'last_name':
        case 'email': {
          this.counters.customer++;
          break;
        }
        case 'from':
        case 'to':
        case 'has_affiliate':
        case 'affiliate_name':
        case 'transaction_type':
        case 'pay_method':
        case 'currency':
        case 'billing_type': {
          this.counters.transaction++;
          break;
        }
      }
    }
  }

  ionViewWillUnload() {
    this.keyboardHideSubscription.unsubscribe();
    this.searchFormExtendedSubscription.unsubscribe();
    this.events.unsubscribe('transactions-params:changed');
  }

}
