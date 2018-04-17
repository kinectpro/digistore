import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, Events } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { AuthService } from '../../../providers/auth-service';
import { User } from '../../../models/user';
import { EventsPage } from '../../../shared/classes/events-page';
import { PushwooshService } from '../../../providers/pushwoosh-service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html',
})
export class AddAccountPage extends EventsPage {

  private loginForm : FormGroup;
  showedError: string = ''; //  from server
  showedErrorPass: string;
  pwdType: string = 'password';
  timer: Observable<any> = Observable.timer(3000);

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

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    if (this.checkAccount(this.username.value)) {
      this.translate.get('SETTINGS_PAGE.MESSAGES.USER_WAS_ADDED_EARLIER').subscribe(mess => this.toastCtrl.create({
        message: mess,
        duration: 3000,
        position: 'bottom'
      }).present());
      this.dismiss();
      return;
    }

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
          this.dismiss();
        }
      },
      err => {
        this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe( value => this.showError(value) );
        console.log('ERROR:', err);
      })
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
    this.timer.subscribe( () => this.showedError = '' );
  }

  dismiss() {
    this.viewCtrl.dismiss(this.authService.user.user_id);
  }

  checkAccount(name: string): User  {
    const nick_name = name.toLowerCase();
    return this.authService.accounts.find(user => user.user_name.toLowerCase() === nick_name || user.user_email.toLowerCase() === nick_name );
  }
}
