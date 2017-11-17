import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../providers/auth-service';
import { TabsPage } from '../../tabs/tabs';
import { Settings } from '../../../config/settings';
import { LandingPage } from '../landing';
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
  mesConnProblem: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, public fb: FormBuilder,
              public http: HttpClient, public translate: TranslateService, public authService: AuthService) {

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
    this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe(value => this.mesConnProblem = value);
    this.http.get(`${Settings.BASE_URL}${Settings.API_KEY}/json/createApiKey?username=${this.loginForm.get('username').value}&password=${this.loginForm.get('password').value}&language=${this.translate.currentLang}`).subscribe(
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
          this.navCtrl.setRoot(TabsPage);
        }
      },
      err => {
        this.showError(this.mesConnProblem);
        console.log('ERROR:', err);
      })
  }

  async checkValid(field: string) {

    let is_required: string = await this.translate.get('LOGIN_PAGE.IS_REQUIRED', { field: field }).toPromise();
    let min_length: string = await this.translate.get('LOGIN_PAGE.MIN_LENGTH').toPromise();
    let is: string = await this.translate.get('LOGIN_PAGE.IS').toPromise();

    let f = this.loginForm.get(field);
    if (f.errors) {
      if (f.errors.required) {
        this.showedErrorPass = is_required;
        return;
      }
      if (f.errors.minlength) {
        this.showedErrorPass = `${min_length} "${field}" ${is} ${f.errors.minlength.requiredLength}`;
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

  cancel() {
    this.navCtrl.setRoot(LandingPage);
  }

}
