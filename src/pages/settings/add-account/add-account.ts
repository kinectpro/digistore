import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../providers/auth-service';

@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html',
})
export class AddAccountPage {

  private loginForm : FormGroup;
  showedError: string = ''; //  from server
  showedErrorPass: string;
  pwdType: string = 'password';
  mesConnProblem: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fb: FormBuilder,
              public translate: TranslateService, public http: HttpClient, public authService: AuthService) {
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
    console.log('ionViewDidLoad AddAccountPage');
  }

  showPassword() {
    this.pwdType = this.pwdType === 'password' ?  'text' : 'password';
  }

  login() {
    this.translate.get('LOGIN_PAGE.CONNECTION_PROBLEM').subscribe(value => this.mesConnProblem = value);
    this.http.get(Settings.BASE_URL + Settings.API_KEY + '/json/createApiKey?username=' + this.loginForm.get('username').value + '&password=' + this.loginForm.get('password').value + '&language=en').subscribe(
      (res: any) => {
        if (res.result === 'error') {
          this.showError(res.message);
        } else {
          // this.authService.apiKey = res.data.api_key;
          // this.dismiss();
        }
      },
      err => {
        this.showError(this.mesConnProblem);
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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
