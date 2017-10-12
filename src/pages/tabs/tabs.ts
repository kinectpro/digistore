import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { TicketPage } from '../ticket/ticket';
import { TransactionsPage } from '../transactions/transactions';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabTransactions = TransactionsPage;
  tabTicket = TicketPage;
  tabSettings = SettingsPage;

  constructor() {

  }
}
