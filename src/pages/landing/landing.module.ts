/**
 * Created by Andrey Okhotnikov on 17.11.17.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TranslateModule } from '@ngx-translate/core';
import { LandingPage } from './landing';
import { LoginPage } from './login/login';

@NgModule({
  declarations: [
    LandingPage,
    LoginPage
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(LandingPage),
  ],
  entryComponents: [
    LoginPage
  ],
  exports: [
    LandingPage
  ]
})
export class LandingPageModule {}
