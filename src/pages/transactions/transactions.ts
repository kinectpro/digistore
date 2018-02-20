import { Component, ViewChild } from '@angular/core';
import {
  App, ModalController, NavController, NavParams, Events, Refresher, Content,
  InfiniteScroll
} from 'ionic-angular';

import { TransactionService } from '../../providers/transaction-service';
import { Params } from '../../models/params';
import { EarningService } from "../../providers/earning-service";
import { ErrorService } from '../../providers/error-service';
import { TransactionDetailsPage } from './transaction-details/transaction-details';
import { SortByPage } from './sort-by/sort-by';
import { SearchPage } from './search/search';
import { SettingsService } from '../../providers/settings-service';
import { Settings } from '../../config/settings';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
  needDataUpdate: boolean = false;
  periods: string[] = [
    'day', 'week', 'month', 'year'
  ];
  params: Params = {
    sort: {
      sort_by: 'date',
      sort_order: 'asc'
    },
    search: {}
  };
  currentPeriod: string;
  showedSearchInput: boolean = false;
  searchInputValue: string = '';
  filterCount: number = 0;
  page: number = 1;

  infiniteScroll: InfiniteScroll;

  transactionsFromService: any[];
  transactions: any = [];

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App, public settingsSrv: SettingsService,
              public eServ: EarningService, public tranServ: TransactionService, public events: Events, public errSrv: ErrorService) {
    this.currentPeriod = this.eServ.currentPeriod;
    if (this.eServ.range) {
      this.params.search.from = this.eServ.range[0];
      this.params.search.to = this.eServ.range[1];
    }
    if (this.settingsSrv.currentCurrency && this.currentPeriod || this.eServ.range) {
      this.params.search.currency = this.settingsSrv.currentCurrency;
    }
    this.getTransactions();
  }

  ionViewDidLoad() {
    console.log('Init TransactionsPage');

    this.events.subscribe('period:changed', period => {
      this.currentPeriod = period;
      this.params.search = {};
      this.params.search.currency = this.settingsSrv.currentCurrency;
      this.getTransactions();
    });
    this.events.subscribe('range:changed', (from, to) => {
      this.currentPeriod = '';
      this.params.search.from = from;
      this.params.search.to = to;
      this.params.search.currency = this.settingsSrv.currentCurrency;
      this.getTransactions();
    });
    this.events.subscribe('user:changed', () => this.needDataUpdate = true);
  }

  ionViewWillEnter() {
    if (this.needDataUpdate) {
      this.showAll();
      this.needDataUpdate = false;
    }
  }

  openTransaction(transaction: any) {
    // this.navCtrl.push(TransactionDetailsPage, {transaction: transaction});
    this.app.getRootNav().push(TransactionDetailsPage, {transaction: transaction});
  }

  doRefresh(refresher: Refresher) {
    refresher.complete();
    this.page = 1;
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
    this.getTransactions();
  }

  getTransactions(page: number = 1, event: InfiniteScroll = null) {
    this.tranServ.getTransactionList(this.currentPeriod, this.params, page).then(
      res => {
        if (page == 1)
          this.transactionsFromService = res;
        else {
          this.transactionsFromService = this.transactionsFromService.concat(res);

          if (event != null) {
            event.complete();
            if (res.length < Settings.ITEMS_PER_PAGE) {
              event.enable(false);
            }
          }
        }
        this.updateTransactions();
        this.filterCount = this.getSearchAmount();
      },
      err => this.errSrv.showMessage(err)
    );
  }

  loadMoreTransactions(event) {
    this.infiniteScroll = event;
    this.page = event == null ? 1 : this.page + 1;
    this.getTransactions(this.page, event);
  }

  showAll() {
    this.currentPeriod = '';
    this.searchInputValue = '';
    this.showedSearchInput = false;
    this.params.search = {};
    this.getTransactions();
    this.content.resize();
  }

  goNext() {
    let index = this.periods.indexOf(this.currentPeriod);
    if (index + 1 >= this.periods.length) {
      this.currentPeriod = this.periods[0];
    } else {
      this.currentPeriod = this.periods[index + 1];
    }
    this.getTransactions();
  }

  goPrev() {
    let index = this.periods.indexOf(this.currentPeriod);
    if (index == 0) {
      this.currentPeriod = this.periods[this.periods.length - 1];
    } else {
      this.currentPeriod = this.periods[index - 1];
    }
    this.getTransactions();
  }

  sortBy() {
    const sortByPageModal = this.modalCtrl.create(SortByPage, { params_sort: this.params.sort });
    sortByPageModal.onDidDismiss(res => {
      if (res && res.params_changed) {
        this.params.sort = res.params_sort;
        this.getTransactions();
      }
    });
    sortByPageModal.present();
  }

  openSearch() {
    const searchPageModal = this.modalCtrl.create(SearchPage, { params_search: this.params.search });
    searchPageModal.onDidDismiss(res => {
      if (res && res.params_changed) {
        this.params.search = res.params_search;
        this.getTransactions();
      }
    });
    searchPageModal.present();
  }

  updateTransactions() {
    this.transactions = this.getFilteredTransactions(this.searchInputValue);
  }

  showSearchInput(flag: boolean): void {
    if (!flag) this.searchInputValue = '';
    this.updateTransactions();
    this.showedSearchInput = flag;
  }

  /**
   * The method filters transactions by name
   * @param value
   * @returns {array}
   */
  getFilteredTransactions(value: string) {
    let val = value.trim().toLowerCase();
    if (!val) {
      return this.transactionsFromService;
    }
    return this.transactionsFromService.filter(item => {
      return item.name.trim().toLowerCase().indexOf(val) >= 0;
    });
  }
  /**
   * Returns true if specified object has no properties, false otherwise.
   *
   * @param obj
   * @returns {boolean}
   */
  isEmptyObject(obj: Object): boolean {
    for (let name in obj ) {
      return false;
    }
    return true;
  }

  getSearchAmount(): number{
    let count = 0;
    Object.keys(this.params.search).map(key => this.params.search[key]).map(value => {
      if (value) {
        count++;
      }
    });
    return count;
  }

}
