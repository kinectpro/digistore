import { Injectable } from "@angular/core";
import { Device } from '@ionic-native/device';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { StorageService } from './storage-service';

declare var cordova : any;

let PUSHWOOSH_APP_ID = 'D8313-6774B'; //old project
// let PUSHWOOSH_APP_ID = '5A6CD-E52F0';  // dev project
// let PUSHWOOSH_APP_ID = '8D6EB-3CCF3';  // new project

// let GOOGLE_PROJECT_NUMBER = '340402504356'; //old project (not working)
let GOOGLE_PROJECT_NUMBER = '727787006045'; //old  project
// let GOOGLE_PROJECT_NUMBER = '933731488416'; // dev project
// let GOOGLE_PROJECT_NUMBER = '829938099620'; // new project

// For iOS, open your project .pList file in xCode and add:
// 1) "Pushwoosh_APPID" key  with the Pushwoosh App Id value
// 2a) Add a new row and, on the left column, select "Required background modes".
// 2b) Open that row to see "Item 0" row, click on the right column and type: remote-notification. Press Enter.

@Injectable()
export class PushwooshService {

  constructor(public events: Events, public device: Device, public auth: AuthService, public http: HttpClient, public store: StorageService) {
    console.log('Init PushwooshService');
    this.events.subscribe('send token', token => this.sendPushToken(token) );
  }

  init() {

    if (!this.device) {
      console.log('PushwooshService init: No device object available.  Skipping init.  (Probably not running in a deployed Cordova app.)');
      return;
    }

    switch (this.device.platform) {
      case 'iOS':
        console.log('Starting iOS Pushwoosh initialization');
        this.initIOS();
        break;
      case 'Android':
        console.log('Starting Android Pushwoosh initialization');
        this.initAndroid();
        break;
      default:
        console.log('Unknown Cordova platform', this.device.platform, '. Skipping Pushwoosh initialization');
    }
  }

  initIOS() {
    let self = this;
    let pushNotification = cordova.require('pushwoosh-cordova-plugin.PushNotification');

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification',  (event: any) => {

      //display alert to the user for example
      // alert(event.notification.aps.alert);

      //clear the app badge
      pushNotification.setApplicationIconBadgeNumber(0);
    });

    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid: PUSHWOOSH_APP_ID});

    //register for pushes
    pushNotification.registerDevice(
      status => {
        let deviceToken = status['deviceToken'];
        console.warn('registerDevice: ' + deviceToken);
        self.sendPushToken(deviceToken);
      },
      status => console.warn('failed to register : ' + JSON.stringify(status))
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);
  }

  initAndroid() {
    let self = this;
    let pushNotification = cordova.require('pushwoosh-cordova-plugin.PushNotification');

    //set push notifications handler
    document.addEventListener('push-notification', (event: any) => {
      let userData = event.notification.userdata;
      if (typeof(userData) != 'undefined') {
        console.warn('user data: ' + JSON.stringify(userData));
      }
    });

    //initialize Pushwoosh with projectid: GOOGLE_PROJECT_NUMBER, pw_appid : PUSHWOOSH_APP_ID. This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({projectid: GOOGLE_PROJECT_NUMBER, pw_appid: PUSHWOOSH_APP_ID});

    //register for pushes
    pushNotification.registerDevice(
      status => {
        let pushToken = status.pushToken;
        console.warn('push token: ' + JSON.stringify(pushToken));
        self.sendPushToken(pushToken);
      },
      status => console.warn(JSON.stringify(['failed to register ', status]))
    );
  }

  sendPushToken(token: any) {
    if (token) {
      this.store.pushToken = token;
    }

    if (this.auth.isLoggedIn()) {
      let vibration = (localStorage.getItem('vibrationEnabled') == 'true') ? 'N' : 'Y';

      let httpParams = new HttpParams();
      httpParams = httpParams
        .append('token', this.store.pushToken)
        .append('enabled', this.store.notify ? 'Y' : 'N')
        .append('sound', this.store.sound ? 'Y' : 'N')
        .append('vibration', vibration);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/setAppPushToken`, { params: httpParams }).subscribe(
        (res: any) => {
          // alert(`Regitered push successfully with next params: token=${token}&enabled=${enabled}&sound=${sound}&vibration=${vibration}`);
          console.log(res);
        }, (err: any) => {
          // alert('Regitered push ERROR');
        }
      );
    }
  }

}
