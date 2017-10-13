import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LandingPage } from '../landing/landing';
import { Settings } from '../../config/settings';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm : FormGroup;
  showedError: string = ''; //  from server
  showedErrorPass: string;
  pwdType: string = 'password';

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, public http: HttpClient, public fb: FormBuilder) {
    this.loginForm = fb.group({
      'username': ['', [
        Validators.required
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    // @todo change language "en" in the future
    // this.navCtrl.setRoot(TabsPage);
    this.http.get(Settings.BASE_URL + Settings.API_KEY + '/json/createApiKey?username=' + this.loginForm.get('username').value + '&password=' + this.loginForm.get('password').value + '&language=en').subscribe(
      (res: any) => {
        if (res.result === 'error') {
          this.showError(res.message);
        } else {
          // @todo save user details to local storage
          this.navCtrl.setRoot(TabsPage);
        }
      },
      err => {
        this.showError('Connection problem');
        console.log('ERROR:', err);
      })
  }

  checkValid(field: string): void {
    let f = this.loginForm.get(field);
    if (f.errors) {
      if (f.errors.required) {
        this.showedErrorPass = field + ' is required';
        return;
      }
      if (f.errors.minlength) {
        this.showedErrorPass = 'min length of ' + field + ' is ' + f.errors.minlength.requiredLength;
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
    this.iab.create(url, '_self', {location:'no'});
  }

  cancel() {
    this.navCtrl.setRoot(LandingPage);
  }

}
