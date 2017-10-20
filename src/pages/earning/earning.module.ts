import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EarningPage } from './earning';

@NgModule({
    declarations: [
        EarningPage,
    ],
    imports: [
        IonicPageModule.forChild(EarningPage),
    ],
    exports: [
        EarningPage
    ]
})
export class EarningPageModule {}