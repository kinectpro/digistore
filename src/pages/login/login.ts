import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../providers/auth-service';
import { Settings } from '../../config/settings';
import { TabsPage } from '../tabs/tabs';
import { PushwooshService } from '../../providers/pushwoosh-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, public fb: FormBuilder,
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

  ionViewDidLoad() {
    console.log('Init LoginPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    this.http.get(`${Settings.BASE_URL}${Settings.API_KEY}/json/createApiKey?username=${this.loginForm.get('username').value}&password=${encodeURIComponent(this.loginForm.get('password').value)}&language=${this.translate.currentLang}`).subscribe(
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
        this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe(value => this.showError(value));
        console.log('ERROR:', err);
      });
  }

  checkValid(field: string) {
    let f = this.loginForm.get(field);
    if (f.errors) {
      if (f.errors.required) {
        this.translate.get('LOGIN_PAGE.IS_REQUIRED').subscribe( val => {
          this.showedErrorPass = val;
        });
        return;
      }
      if (f.errors.minlength) {
        this.translate.get('LOGIN_PAGE.MIN_LENGTH', {value: f.errors.minlength.requiredLength}).subscribe(
          val => {
            this.showedErrorPass = val;
          }
        );
      }
    }
  }

  showError(mess: string) {
    this.showedError = mess;
    setTimeout(() => {
      this.showedError = '';
    }, 3000);
  }

  openBrowser(url: string) {
    this.iab.create(Settings.SITE_URL + url, '_self', {location:'no'});
  }

}
