import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketPage } from './ticket';
import { TicketDetailsPage } from './ticket-details/ticket-details';
import { TicketParamsPage } from './ticket-params/ticket-params';
import { TicketScanPage } from './ticket-scan/ticket-scan';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  declarations: [
    TicketPage,
    TicketDetailsPage,
    TicketParamsPage,
    TicketScanPage
  ],
  imports: [
    CalendarModule,
    IonicPageModule.forChild(TicketPage),
  ],
  entryComponents: [
    TicketParamsPage,
    TicketDetailsPage,
    TicketScanPage
  ],
  exports: [
    TicketPage
  ]
})
export class TicketPageModule {}
