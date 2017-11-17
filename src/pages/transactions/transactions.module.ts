/**
 * Created by Andrey Okhotnikov on 17.11.17.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { TransactionsPage } from './transactions';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDetailsPage } from './transaction-details/transaction-details';
import { SortByPage } from './sort-by/sort-by';
import { SearchPage } from './search/search';
import { ReportResultPage } from './report-result/report-result';
import { ReportPage } from './report/report';
import { ParamsPage } from './params/params';
import { AutoCompleteModule } from 'ionic2-auto-complete';


@NgModule({
  declarations: [
    TransactionsPage,
    TransactionDetailsPage,
    ReportResultPage,
    ParamsPage,
    ReportPage,
    SortByPage,
    SearchPage,
  ],
  imports: [
    SharedModule,
    TranslateModule,
    AutoCompleteModule,
    IonicPageModule.forChild(TransactionsPage),
  ],
  entryComponents: [
    TransactionDetailsPage,
    ReportResultPage,
    ParamsPage,
    ReportPage,
    SortByPage,
    SearchPage
  ],
  exports: [
    TransactionsPage,
  ]
})
export class TransactionsPageModule {}
