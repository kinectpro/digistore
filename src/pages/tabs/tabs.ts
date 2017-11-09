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

  tabEarning = EarningPage;
  tabTransactions = TransactionsPage;
  tabTicket = TicketPage;
  tabSettings = SettingsPage;

  constructor(public navParams: NavParams, public translate: TranslateService) {
    this.tabID = this.navParams.get('tab');
  }
}
