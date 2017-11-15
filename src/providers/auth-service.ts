import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../config/settings';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthService {

  private _lang: string;
  private _user: User;
  private _accounts: User[];

  constructor(public http: HttpClient, public translate: TranslateService, public events: Events) {
    console.log('Hello AuthServiceProvider Provider');
    this._lang = localStorage.getItem('lang') || 'de';
    this._user = JSON.parse(localStorage.getItem('user')) || null;
    this._accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  }

  get apiKey(): string {
    return this.user.api_key;
  }

  get accounts(): User[] {
    return this._accounts;
  }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    this._accounts.push(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accounts', JSON.stringify(this._accounts));
    this.events.publish('user:changed');
  }

  changeUser(user: User) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.events.publish('user:changed');
  }

  deleteUser(user: User) {
    this.unregister(user.api_key).then(
      res => {
        this._accounts = this._accounts.filter(item => item.user_id != user.user_id);
        localStorage.setItem('accounts', JSON.stringify(this._accounts));
      },
      err => console.log(err)
    );
  }

  get lang(): string {
    return this._lang;
  }

  set lang(value: string) {
    localStorage.setItem('lang', value);
    this._lang = value;
  }

  isLoggedIn(): boolean {
    return this._user !== null;
  }

  logout(): void {
    this._user = null;
    localStorage.removeItem('user');
    this.unregisterAll(this._accounts).then(() => {
      this._accounts = [];
      localStorage.removeItem('accounts');
    });
  }

  unregister(api_key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(Settings.BASE_URL + api_key + '/json/unregister?language=' + this.translate.currentLang).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve();
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

  async unregisterAll(users: User[]) {
    for (let i = 0; i < users.length; i++) {
      await this.unregister(users[i].api_key);
    }
    return Promise.resolve();
  };

}
