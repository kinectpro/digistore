import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsPage } from '../pages/settings/settings';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TicketPage } from '../pages/ticket/ticket';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoadingInterceptor } from '../providers/loading-interceptor';
import { AuthService } from '../providers/auth-service';
import { EarningService } from '../providers/earning-service';
import { SettingsService } from '../providers/settings-service';
import { CompleteService } from '../providers/complete-service';
import { TransactionService } from '../providers/transaction-service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SortByPage } from '../pages/sort-by/sort-by';
import { TransactionDetailsPage } from '../pages/transaction-details/transaction-details';
import { TicketParamsPage } from '../pages/ticket-params/ticket-params';
import { SearchPage } from '../pages/search/search';
import { ReportPage } from '../pages/report/report';
import { ParamsPage } from '../pages/params/params';
import { EarningPageModule } from '../pages/earning/earning.module';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { CalendarModule } from 'ion2-calendar';
import { ReportResultPage } from '../pages/report-result/report-result';
import { KeysPipe } from '../pipes/keys-pipe';
import { Keyboard } from '@ionic-native/keyboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TransactionsPage,
    TicketPage,
    TicketParamsPage,
    SettingsPage,
    LandingPage,
    LoginPage,
    TabsPage,
    ParamsPage,
    SortByPage,
    SearchPage,
    ReportPage,
    KeysPipe,
    ReportResultPage,
    TransactionDetailsPage
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    HttpClientModule,
    EarningPageModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      backButtonText: 'Back',
      backButtonIcon: 'ios-arrow-back'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TransactionsPage,
    TicketPage,
    TicketParamsPage,
    LandingPage,
    LoginPage,
    TabsPage,
    SortByPage,
    SearchPage,
    ReportPage,
    ParamsPage,
    ReportResultPage,
    SettingsPage,
    TransactionDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    InAppBrowser,
    TranslateService,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    AuthService,
    EarningService,
    CompleteService,
    SettingsService,
    TransactionService
  ]
})
export class AppModule {}
