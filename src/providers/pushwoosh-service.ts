import {Injectable} from "@angular/core";
import { Device } from '@ionic-native/device';

declare var cordova : any;

// let PUSHWOOSH_APP_ID = 'D8313-6774B';
let PUSHWOOSH_APP_ID = '5A6CD-E52F0';
// let GOOGLE_PROJECT_NUMBER = '340402504356';
let GOOGLE_PROJECT_NUMBER = '933731488416';

// For iOS, open your project .pList file in xCode and add:
// 1) "Pushwoosh_APPID" key  with the Pushwoosh App Id value
// 2a) Add a new row and, on the left column, select "Required background modes".
// 2b) Open that row to see "Item 0" row, click on the right column and type: remote-notification. Press Enter.

@Injectable()
export class PushwooshService {

  constructor(public device: Device) {

  }

  init() {
    console.log("PushwooshService init");

    if(!this.device) {
      console.log("PushwooshService init: No device object available.  Skipping init.  (Probably not running in a deployed Cordova app.)");
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
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function (event:any) {
      //get the notification payload
      var notification = event.notification;

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
        var deviceToken = status['deviceToken'];
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
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification', function (event:any) {
      var title    = event.notification.title;
      var userData = event.notification.userdata;

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
        var pushToken = status;
        console.warn('push token: ' + JSON.stringify(pushToken));
        // alert('push token: ' + JSON.stringify(pushToken));
      },
      function (status) {
        console.warn(JSON.stringify(['failed to register ', status]));
      }
    );
  }

}
