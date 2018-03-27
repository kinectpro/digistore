/**
 * Created by Andrey Okhotnikov on 26.03.18.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChooseLanguagePage } from './choose-language';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChooseLanguagePage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ChooseLanguagePage),
  ],
  exports: [
    ChooseLanguagePage
  ]
})
export class ChooseLanguagePageModule {}
