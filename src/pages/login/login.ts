import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../providers/auth-service';
import { Settings } from '../../config/settings';
import { TabsPage } from '../tabs/tabs';
import { PushwooshService } from '../../providers/pushwoosh-service';
import { ChooseLanguagePage } from '../choose-language/choose-language';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm : FormGroup;
  showedError: string = ''; //  from server
  showedErrorPass: string;
  pwdType: string = 'password';
  language: string;
  timer: Observable<any> = Observable.timer(3000);

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, public fb: FormBuilder, public device: Device,
              public http: HttpClient, public translate: TranslateService, public authService: AuthService, public pushwooshService: PushwooshService) {

    this.loginForm = fb.group({
      'username': ['', [
        Validators.required
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });

    this.language = this.translate.currentLang;
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  ionViewDidLoad() {
    console.log('Init LoginPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ? 'text' : 'password';
  }

  login() {
    let httpParams = new HttpParams();
    httpParams = httpParams
      .append('username', this.username.value)
      .append('password', encodeURIComponent(this.password.value))
      .append('device_name', encodeURIComponent(this.device.manufacturer + ' ' + this.device.model))
      .append('language', this.translate.currentLang);
    this.http.get(`${Settings.BASE_URL}${Settings.API_KEY}/json/createApiKey`, { params: httpParams }).subscribe(
      (res: any) => {
        if (res.result === 'error') {
          this.showError(res.message);
        } else {
          this.authService.user = {
            api_key: res.data.api_key,
            user_id: res.data.user_id,
            user_name: res.data.user_name,
            user_email: res.data.user_email,
            first_name: res.data.first_name,
            last_name: res.data.last_name
          };
          this.pushwooshService.sendPushToken(false);
          this.navCtrl.setRoot(TabsPage);
        }
      },
      err => {
        this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe( value => this.showError(value) );
        console.log('ERROR:', err);
      });
  }

  async checkValid(field: string) {
    let f = this.loginForm.get(field);
    if (f.errors) {
      if (f.errors.required) {
        this.showedErrorPass = await this.translate.get('LOGIN_PAGE.IS_REQUIRED').toPromise();
        return;
      }
      if (f.errors.minlength) {
        this.showedErrorPass = await this.translate.get('LOGIN_PAGE.MIN_LENGTH', { value: f.errors.minlength.requiredLength }).toPromise();
      }
    }
  }

  showError(mess: string) {
    this.showedError = mess;
    this.timer.subscribe( () => this.showedError = '' ); // flow dies and don't need to unsubscribe
  }

  openBrowser(url: string) {
    this.iab.create(Settings.SITE_URL + url, '_self', {location:'no'});
  }

  back() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
    else {
      this.navCtrl.setRoot(ChooseLanguagePage);
    }
  }

}
