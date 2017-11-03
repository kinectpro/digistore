import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketPage } from './ticket';
import { TicketDetailsPage } from './ticket-details/ticket-details';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketScanPage } from './ticket-scan/ticket-scan';
import { CalendarModule } from 'ion2-calendar';
import { TicketCheckPage } from './ticket-check/ticket-check';
import { TicketSearchResultsPage } from './ticket-search-results/ticket-search-results';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';

@NgModule({
  declarations: [
    TicketPage,
    TicketDetailsPage,
    TicketParamsPage,
    TicketCheckPage,
    TicketSearchResultsPage,
    TicketQrScannerPage,
    TicketScanPage
  ],
  imports: [
    CalendarModule,
    IonicPageModule.forChild(TicketPage),
  ],
  entryComponents: [
    TicketParamsPage,
    TicketDetailsPage,
    TicketScanPage,
    TicketSearchResultsPage,
    TicketQrScannerPage,
    TicketCheckPage
  ],
  exports: [
    TicketPage
  ]
})
export class TicketPageModule {}
