import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, Events } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { AuthService } from '../../../providers/auth-service';
import { User } from '../../../models/user';
import { EventsPage } from '../../../shared/classes/events-page';
import 'rxjs/add/operator/toPromise';
import { PushwooshService } from '../../../providers/pushwoosh-service';

@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html',
})
export class AddAccountPage extends EventsPage {

  private loginForm : FormGroup;
  showedError: string = ''; //  from server
  showedErrorPass: string;
  pwdType: string = 'password';
  mesConnProblem: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fb: FormBuilder, public events: Events, public device: Device,
              public translate: TranslateService, public http: HttpClient, public authService: AuthService, public toastCtrl: ToastController, public pushwooshService: PushwooshService) {
    super(events);
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
    console.log('Init AddAccountPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    if (this.checkAccount(this.loginForm.get('username').value)) {
      this.translate.get('SETTINGS_PAGE.MESSAGES.USER_WAS_ADDED_EARLIER').subscribe(mess => this.toastCtrl.create({
        message: mess,
        duration: 3000,
        position: 'bottom'
      }).present());
      this.dismiss();
      return;
    }
    this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe(value => this.mesConnProblem = value);
    const deviceName = encodeURIComponent(this.device.manufacturer + ' ' + this.device.model);
    this.http.get(`${Settings.BASE_URL}${Settings.API_KEY}/json/createApiKey?username=${this.loginForm.get('username').value}&password=${encodeURIComponent(this.loginForm.get('password').value)}&device_name=${deviceName}&language=${this.translate.currentLang}`).subscribe(
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
          this.dismiss();
        }
      },
      err => {
        this.showError(this.mesConnProblem);
        console.log('ERROR:', err);
      })
  }

  async checkValid(field: string) {
    let is_required: string = await this.translate.get('LOGIN_PAGE.IS_REQUIRED').toPromise();

    let f = this.loginForm.get(field);
    if (f.errors) {
      if (f.errors.required) {
        this.showedErrorPass = is_required;
        return;
      }
      if (f.errors.minlength) {
        let min_length: string = await this.translate.get('LOGIN_PAGE.MIN_LENGTH', {value: f.errors.minlength.requiredLength}).toPromise();
        this.showedErrorPass = `${min_length}`;
      }
    }
  }

  showError(mess: string) {
    this.showedError = mess;
    setTimeout(() => {
      this.showedError = '';
    }, 3000);
  }

  dismiss() {
    this.viewCtrl.dismiss(this.authService.user.user_id);
  }

  checkAccount(name: string): User  {
    const nick_name = name.toLowerCase();
    return this.authService.accounts.find(user => user.user_name.toLowerCase() === nick_name || user.user_email.toLowerCase() === nick_name );
  }
}
