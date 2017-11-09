import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailsPage } from './transaction-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionDetailsPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(TransactionDetailsPage),
  ],
})
export class TransactionDetailsPageModule {}
