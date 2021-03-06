import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { EarningPage } from '../earning/earning';
import { SettingsPage } from '../settings/settings';
import { TicketPage } from '../ticket/ticket';
import { TransactionsPage } from '../transactions/transactions';
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
    this.translate.onLangChange.subscribe(params => this.initVariables());
    this.initVariables();
  }

  initVariables() {
    this.translate.get(['GENERAL.EARNINGS', 'GENERAL.TRANSACTIONS', 'GENERAL.E_TICKET', 'GENERAL.SETTINGS']).subscribe( obj => {
      this.earnings = obj['GENERAL.EARNINGS'];
      this.transactions = obj['GENERAL.TRANSACTIONS'];
      this.eticket = obj['GENERAL.E_TICKET'];
      this.settings = obj['GENERAL.SETTINGS'];
    });
  }
}
