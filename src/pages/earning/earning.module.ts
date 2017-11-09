import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EarningPage } from './earning';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        EarningPage,
    ],
    imports: [
        TranslateModule,
        IonicPageModule.forChild(EarningPage),
    ],
    exports: [
        EarningPage
    ]
})
export class EarningPageModule {}
