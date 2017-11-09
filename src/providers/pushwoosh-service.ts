import {Injectable} from "@angular/core";
import { Platform } from 'ionic-angular';

declare let cordova : any;

let PUSHWOOSH_APP_ID = 'D8313-6774B';
let GOOGLE_PROJECT_NUMBER = '340402504356';

// For iOS, open your project .pList file in xCode and add:
// 1) "Pushwoosh_APPID" key  with the Pushwoosh App Id value
// 2a) Add a new row and, on the left column, select "Required background modes".
// 2b) Open that row to see "Item 0" row, click on the right column and type: remote-notification. Press Enter.

@Injectable()
export class PushwooshService {

  constructor(public platform: Platform) {

  }

  init() {
    console.log("PushwooshService init");

    if (this.platform.is('ios')) {
      console.log('Starting iOS Pushwoosh initialization');
      // this.initIOS();
    } else if (this.platform.is('android')) {
      console.log('Starting Android Pushwoosh initialization');
      // this.initAndroid();
    } else {
      console.log('Unknown Cordova platform', this.device.platform, '. Skipping Pushwoosh initialization');
    }
  }

  initIOS() {
    let pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function (event:any) {
      //get the notification payload
      let notification = event.notification;

      //display alert to the user for example
      alert(notification.aps.alert);

      //clear the app badge
      pushNotification.setApplicationIconBadgeNumber(0);
    });

    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid: PUSHWOOSH_APP_ID});

    //register for pushes
    pushNotification.registerDevice(
      function (status) {
        let deviceToken = status['deviceToken'];
        console.warn('registerDevice: ' + deviceToken);
      },
      function (status) {
        console.warn('failed to register : ' + JSON.stringify(status));
        alert(JSON.stringify(['failed to register ', status]));
      }
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);
  }

  initAndroid() {
    let pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    //set push notifications handler
    document.addEventListener('push-notification', function (event:any) {
      let title    = event.notification.title;
      let userData = event.notification.userdata;

      if (typeof(userData) != "undefined") {
        console.warn('user data: ' + JSON.stringify(userData));
      }

      alert(title);
    });

    //initialize Pushwoosh with projectid: GOOGLE_PROJECT_NUMBER, pw_appid : PUSHWOOSH_APP_ID. This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({projectid: GOOGLE_PROJECT_NUMBER, pw_appid: PUSHWOOSH_APP_ID});

    //register for pushes
    pushNotification.registerDevice(
      function (status) {
        let pushToken = status;
        console.warn('push token: ' + pushToken);
        console.log(pushToken);
      },
      function (status) {
        console.warn(JSON.stringify(['failed to register ', status]));
      }
    );
  }

  generateNotification() {
    let pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    pushNotification.createLocalNotification({ msg: "Your pumpkins are ready!", seconds: 1, userData: "optional" }, function () { console.log('success') }, function () { console.log('fail'); });
  }

}
