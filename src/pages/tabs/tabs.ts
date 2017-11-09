import { Component } from '@angular/core';

import { EarningPage } from '../earning/earning';
import { SettingsPage } from '../settings/settings';
import { TicketPage } from '../ticket/ticket';
import { TransactionsPage } from '../transactions/transactions';
import { NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabID: number = 0;
  earnings: string = ' ';
  transactions: string = ' ';
  eticket: string = ' ';
  settings: string = ' ';

  tabEarning = EarningPage;
  tabTransactions = TransactionsPage;
  tabTicket = TicketPage;
  tabSettings = SettingsPage;

  constructor(public navParams: NavParams, public translate: TranslateService) {
    this.tabID = this.navParams.get('tab');
    this.translate.onLangChange.subscribe(params => {
      this.translate.get('GENERAL.EARNINGS').subscribe(val => this.earnings = val);
      this.translate.get('GENERAL.TRANSACTIONS').subscribe(val => this.transactions = val);
      this.translate.get('GENERAL.E_TICKET').subscribe(val => this.eticket = val);
      this.translate.get('GENERAL.SETTINGS').subscribe(val => this.settings = val);
    });
  }
}
