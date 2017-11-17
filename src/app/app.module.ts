import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { QRScanner } from '@ionic-native/qr-scanner';
import { OneSignal } from '@ionic-native/onesignal';
import { FileTransfer } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';

import { LandingPageModule } from '../pages/landing/landing.module';
import { EarningPageModule } from '../pages/earning/earning.module';
import { TicketPageModule } from '../pages/ticket/ticket.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TransactionsPageModule } from '../pages/transactions/transactions.module';

import { TabsPage } from '../pages/tabs/tabs';

import { LoadingInterceptor } from '../providers/loading-interceptor';
import { AuthService } from '../providers/auth-service';
import { EarningService } from '../providers/earning-service';
import { SettingsService } from '../providers/settings-service';
import { CompleteService } from '../providers/complete-service';
import { TransactionService } from '../providers/transaction-service';
import { TicketService } from '../providers/ticket-service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    LandingPageModule,
    TransactionsPageModule,
    TicketPageModule,
    EarningPageModule,
    SettingsPageModule,
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
      backButtonIcon: 'ios-arrow-back',
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    InAppBrowser,
    FileTransfer,
    File,
    FileOpener,
    TranslateService,
    OneSignal,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    AuthService,
    EarningService,
    CompleteService,
    SettingsService,
    TicketService,
    TransactionService
  ]
})
export class AppModule {}
