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
  currentPeriod: string;
  showedSearchInput: boolean = false;
  searchInputValue: string = '';

  transactionsFromService: any[];
  transactions: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App, public tranServ: TransactionService) {
    this.currentPeriod = this.navParams.get('period');
    this.tranServ.getTransactions(this.currentPeriod).then(
      res => this.transactions = res,
      err => console.log(err)
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
  }

  openTransaction(transaction: any) {
    console.log(transaction);
    // this.navCtrl.push(TransactionDetailsPage, {transaction: transaction});
    this.app.getRootNav().push(TransactionDetailsPage, {transaction: transaction});
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
  }

  goPrev() {
    let index = this.periods.indexOf(this.currentPeriod);
    if (index == 0) {
      this.currentPeriod = this.periods[this.periods.length - 1];
    } else {
      this.currentPeriod = this.periods[index - 1];
    }
  }

  sortBy(params: any) {
    const profileModal = this.modalCtrl.create(SortByPage, {period: this.currentPeriod});
    profileModal.present();
  }

  openSearch() {
    this.app.getRootNav().push(SearchPage);
  }

  updateTransactions() {
    this.transactions = this.getTransactions(this.searchInputValue);
  }

  showSearchInput(flag: boolean): void {
    if (!flag) this.searchInputValue = '';
    this.updateTransactions();
    this.showedSearchInput = flag;
  }

  getTransactions(value: string) {
    let val = value.trim().toLowerCase();
    if (!val) {
      return this.transactionsFromService;
    }
    return this.transactionsFromService.filter(item => {
      return item.name.trim().toLowerCase().indexOf(val) >= 0;
    });
  }

}
