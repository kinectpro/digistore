import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform, Config, Nav, App, Tab, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AppMinimize } from '@ionic-native/app-minimize';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../providers/auth-service';
import { PushwooshService } from '../providers/pushwoosh-service';
import { ChooseLanguagePage } from '../pages/choose-language/choose-language';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  isModalPage: boolean = false;

  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, public translate: TranslateService,
              public authService: AuthService, public events: Events, public keyboard: Keyboard, public config: Config,
              @Inject(DOCUMENT) private document: any, public app: App, public alertCtrl: AlertController, public appMinimize: AppMinimize,
              public _pushService: PushwooshService) {
    platform.ready().then(() => {

      statusBar.backgroundColorByHexString('#1998db');

      this.keyboard.onKeyboardShow().subscribe(() => {
        this.document.body.classList.add('keyboard-is-open');
      });

      this.keyboard.onKeyboardHide().subscribe(() => {
        this.document.body.classList.remove('keyboard-is-open');
      });

      // Confirm exit
      platform.registerBackButtonAction(this.backBtnAction);

      events.subscribe('modalState:changed', val => this.isModalPage = val);

      this.document.getElementById('custom-overlay').style.display = 'none';

    });

    this.authService.initVariables().then( () => {
      // Set the root page
      if (this.authService.isLoggedIn()) {
        this.rootPage = TabsPage;
      }
      else {
        this.authService.langIsSelected().then( res => {
          this.rootPage = res ? LoginPage : ChooseLanguagePage;
        });
      }
      // this.rootPage = this.authService.isLoggedIn() ? TabsPage : this.authService.langIsSelected() ? LoginPage : ChooseLanguagePage;
      // Set the default language for translation strings, and the current language.
      this.translate.setDefaultLang(this.authService.lang);
      this.translate.use(this.authService.lang);

      this.initTextBackBtn();

      this.translate.onLangChange.subscribe( _ => this.initTextBackBtn() );

      if (platform.is("cordova")) {
        this._pushService.init();
        // send push token to the server every 10 days even if the app wasn't closed
        setTimeout(() => {
          this._pushService.sendPushToken(false);
        }, 864000000);
      }

    });

  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  initTextBackBtn() {
    this.translate.get('BACK').subscribe(res => this.config.set('backButtonText', res));
  }

  backBtnAction = () => {
    if (!this.isModalPage && this.nav.getActive().component.name == "TabsPage") {
      let prevTab: Tab = this.nav.getActiveChildNavs()[0].previousTab();
      if (prevTab) {
        let index = prevTab.index;
        this.nav.getActiveChildNavs()[0]._selectHistory.pop();
        this.nav.getActiveChildNavs()[0].select(index);
      } else {

        this.events.publish('modalState:changed', true);

        this.translate.get(['CANCEL', 'EXIT', 'EXIT_MSG']).subscribe(obj => this.alertCtrl.create({
          title: obj['EXIT'],
          message: obj['EXIT_MSG'],
          mode: 'md',
          buttons: [
            {
              text: obj['CANCEL'],
              role: 'cancel',
              handler: () => {
                this.events.publish('modalState:changed', false);
              }
            },
            {
              text: obj['EXIT'],
              handler: () => {
                this.events.publish('modalState:changed', false);
                this.appMinimize.minimize();
              }
            }
          ]
        }).present());
      }

    } else {
      this.app.goBack();
    }
  }
}
