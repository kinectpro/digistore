import { Component } from '@angular/core';
import { App, ModalController, NavController, NavParams } from 'ionic-angular';
import { SortByPage } from '../sort-by/sort-by';
import { TabsPage } from '../tabs/tabs';
import { TransactionDetailsPage } from '../transaction-details/transaction-details';
import { SearchPage } from '../search/search';

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

  transactions: any = [
    {date:'27.11.17 10:23', name: 'afsdfas afsa asfafasf asfsafas asfsaaffaff asfsa', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123},
    {date:'2017', name: 'data1', earning: 23123}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public app: App) {
    this.currentPeriod = this.navParams.get('period');
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

}
