import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { SortByPage } from '../sort-by/sort-by';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
  }

  openTransaction(transaction: any) {
    console.log(transaction);
  }

  showAll() {
    this.currentPeriod = null;
    setTimeout(() => {
      this.currentPeriod = 'day'
    }, 5000);
  }

  sortBy(params: any) {
    const profileModal = this.modalCtrl.create(SortByPage);
    profileModal.present();
  }

}
