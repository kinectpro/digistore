import { Component } from '@angular/core';
import { Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from '../pages/landing/landing';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../providers/auth-service';
import { Keyboard } from '@ionic-native/keyboard';
import { OneSignal } from '@ionic-native/onesignal';
import { Settings } from '../config/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public translate: TranslateService, public authService: AuthService,
              public keyboard: Keyboard, public config: Config, public oneSignal: OneSignal) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#1998db');
      splashScreen.hide();

      this.keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });

      this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });

      if (platform.is("cordova")) {
        this.initOneSignal();
      }
    });
    // Set the root page
    this.rootPage = this.authService.isLoggedIn() ? TabsPage : LandingPage;
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(this.authService.lang);
    this.translate.use(this.authService.lang);

    this.initTextBackBtn();

    this.translate.onLangChange.subscribe( _ => this.initTextBackBtn() );

  }

  initTextBackBtn() {
    this.translate.get('BACK').subscribe(res => this.config.set('backButtonText', res));
  }

  initOneSignal() {

    this.oneSignal.startInit(Settings.ONE_SIGNAL_APPID, Settings.GOOGLE_PROJECT_NUMBER);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      // alert(JSON.stringify(data))
    });

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      if (data.notification.payload.additionalData) {
        // alert(data.notification.payload.additionalData);

        //let additionalData = data.notification.payload.additionalData;
        //let product_id = additionalData.product_id;
        //let category_id = additionalData.category_id;


      }
    });

    this.oneSignal.endInit();
  }
}
