import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform, Config, Nav, App, Tab, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { OneSignal } from '@ionic-native/onesignal';

import { LandingPage } from '../pages/landing/landing';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../providers/auth-service';
import { Settings } from '../config/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  isModalPage: boolean = false;

  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, public translate: TranslateService, public authService: AuthService, events: Events,
              public keyboard: Keyboard, public config: Config, public oneSignal: OneSignal, @Inject(DOCUMENT) private document: any, public app: App, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#1998db');

      this.keyboard.onKeyboardShow().subscribe(() => {
        this.document.body.classList.add('keyboard-is-open');
      });

      this.keyboard.onKeyboardHide().subscribe(() => {
        this.document.body.classList.remove('keyboard-is-open');
      });

      if (platform.is("cordova")) {
        this.initOneSignal();
      }
      // Confirm exit
      platform.registerBackButtonAction(this.backBtnAction);

      events.subscribe('modalState:changed', val => this.isModalPage = val);

    });
    // Set the root page
    this.rootPage = this.authService.isLoggedIn() ? TabsPage : LandingPage;
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(this.authService.lang);
    this.translate.use(this.authService.lang);

    this.initTextBackBtn();

    this.translate.onLangChange.subscribe( _ => this.initTextBackBtn() );

  }

  ionViewDidLoad() {
    this.splashScreen.hide();
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

  backBtnAction = () => {
    if (!this.isModalPage && this.nav.getActive().component.name == "TabsPage") {
      let prevTab: Tab = this.nav.getActiveChildNavs()[0].previousTab();
      if (prevTab) {
        let index = prevTab.index;
        this.nav.getActiveChildNavs()[0]._selectHistory.pop();
        this.nav.getActiveChildNavs()[0].select(index);
      } else {

        this.translate.get(['CANCEL', 'EXIT', 'EXIT_MSG']).subscribe(obj => this.alertCtrl.create({
          title: obj['EXIT'],
          message: obj['EXIT_MSG'],
          mode: 'ios',
          buttons: [
            {
              text: obj['CANCEL'],
              role: 'cancel',
              handler: () => console.log('choose Cancel')
            },
            {
              text: obj['EXIT'],
              handler: () => this.platform.exitApp()
            }
          ]
        }).present());
      }

    } else {
      this.app.goBack();
    }
  }
}
