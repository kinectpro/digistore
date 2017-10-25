import { Component } from '@angular/core';
import { App, ModalController, NavController, NavParams } from 'ionic-angular';
import { SortByPage } from '../sort-by/sort-by';
import { TabsPage } from '../tabs/tabs';
import { TransactionDetailsPage } from '../transaction-details/transaction-details';
import { SearchPage } from '../search/search';
import { TransactionService } from '../../providers/transaction-service';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
  // @todo Add to constants, add navigation between dates
  periods: string[] = [
    'day', 'week', 'month', 'year'
  ];
  params_sort: any = {
    sort_by: 'date',
    sort_order: 'asc'
  };
  currentPeriod: string;
  showedSearchInput: boolean = false;
  searchInputValue: string = '';

  transactionsFromService: any[];
  transactions: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App, public tranServ: TransactionService) {
    this.currentPeriod = this.navParams.get('period');
    this.getTransactions();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
  }

  openTransaction(transaction: any) {
    // this.navCtrl.push(TransactionDetailsPage, {transaction: transaction});
    this.app.getRootNav().push(TransactionDetailsPage, {transaction: transaction});
  }

  getTransactions() {
    this.tranServ.getTransactionList(this.currentPeriod, this.params_sort).then(
      res => {
        this.transactionsFromService = res;
        this.updateTransactions();
      },
      err => console.log(err)
    );
  }

  showAll() {
    this.app.getRootNav().setRoot(TabsPage, {tab: 1});
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
    const sortByPageModal = this.modalCtrl.create(SortByPage, { params_sort: this.params_sort });
    sortByPageModal.onDidDismiss(res => {
      if (res.params_changed) {
        this.params_sort = res.params_sort;
        this.getTransactions();
      }
    });
    sortByPageModal.present();
  }

  openSearch() {
    this.app.getRootNav().push(SearchPage);
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

}
