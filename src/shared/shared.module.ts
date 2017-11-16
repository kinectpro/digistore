/**
 * Created by FBI on 04.11.2017.
 */
import { NgModule } from '@angular/core';
import { KeysPipe } from './pipes/keys-pipe';
import { MonthsTranslateDirective } from './directives/months-translate';

@NgModule({
  imports:      [ ],
  declarations: [ KeysPipe, MonthsTranslateDirective ],
  exports:      [ KeysPipe, MonthsTranslateDirective ]
})
export class SharedModule { }
