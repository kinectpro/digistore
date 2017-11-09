/**
 * Created by Andrey Okhotnikov on 08.11.17.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddAccountPage } from './add-account/add-account';
import { SettingsPage } from './settings';
import { LanguagePage } from './language/language';
import { AccountPage } from './account/account';
import { EditPage } from './edit/edit';

@NgModule({
  declarations: [
    AddAccountPage,
    SettingsPage,
    LanguagePage,
    AccountPage,
    EditPage
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SettingsPage),
  ],
  entryComponents: [
    AddAccountPage,
    LanguagePage,
    AccountPage,
    EditPage
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule {}