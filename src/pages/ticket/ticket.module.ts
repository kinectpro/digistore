import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TicketPage } from './ticket';
import { TicketDetailsPage } from './ticket-details/ticket-details';
import { TicketScanPage } from './ticket-scan/ticket-scan';
import { CalendarModule } from 'ion2-calendar';
import { TicketCheckPage } from './ticket-check/ticket-check';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketSearchResultsPage } from './ticket-search-results/ticket-search-results';
import { TicketQrScannerPage } from './ticket-qr-scanner/ticket-qr-scanner';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TicketPage,
    TicketParamsPage,
    TicketDetailsPage,
    TicketCheckPage,
    TicketSearchResultsPage,
    TicketQrScannerPage,
    TicketScanPage
  ],
  imports: [
    CalendarModule,
    SharedModule,
    TranslateModule,
    IonicPageModule.forChild(TicketPage),
  ],
  entryComponents: [
    TicketDetailsPage,
    TicketParamsPage,
    TicketScanPage,
    TicketSearchResultsPage,
    TicketQrScannerPage,
    TicketCheckPage
  ],
  exports: [
    TicketPage,
  ]
})
export class TicketPageModule {}
