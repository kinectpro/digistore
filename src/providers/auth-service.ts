import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { User } from '../models/user';
import { Settings } from '../config/settings';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from './error-service';

@Injectable()
export class AuthService {

  private _lang: string;
  private _user: User;
  private _accounts: User[];

  constructor(public http: HttpClient, public translate: TranslateService, public events: Events, public errSrv: ErrorService, public storage: Storage) {
    console.log('Init AuthServiceProvider');
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
    this.storage.set('user', user);
    this.storage.set('accounts', this._accounts);
    this.events.publish('user:changed');
  }

  initVariables(): Promise<any> {
    return new Promise( resolve => {
      
      this.storage.ready().then( ready => {
        Promise.all([
          this.storage.get('lang'),
          this.storage.get('user'),
          this.storage.get('accounts')
        ]).then(results => {
          this._lang = results[0] || 'de';
          this._user = results[1] || null;
          this._accounts = results[2] || [];
          resolve();
        })          
      }).catch( err => {
        console.log(err);
        this._lang = 'de';
        this._user = null;
        this._accounts = [];
        resolve();
      });

    });
  }

  changeUser(user: User) {
    this._user = user;
    this.storage.set('user', user);
    this.events.publish('user:changed');
  }

  deleteUser(user: User) {
    this.unregister(user.api_key).then(
      res => {
        this._accounts = this._accounts.filter(item => item.user_id != user.user_id);
        this.storage.set('accounts', this._accounts);
      },
      err => this.errSrv.showMessage(err)
    );
  }

  get lang(): string {
    return this._lang;
  }

  set lang(value: string) {
    this.storage.set('lang', value);
    this._lang = value;
  }

  async langIsSelected(): Promise<boolean> {
    const lang = await this.storage.get('lang');
    return Promise.resolve(!!lang);
  }

  isLoggedIn(): boolean {
    return this._user !== null;
  }

  logout(): void {
    this._user = null;
    this.storage.remove('user');
    this.unregisterAll(this._accounts).then(() => {
      this._accounts = [];
      this.storage.remove('accounts');
    });
  }

  unregister(api_key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${api_key}/json/unregister?language=${this.translate.currentLang}`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            this.http.get(`${Settings.BASE_URL}${api_key}/json/setAppPushToken?token=${localStorage.getItem('pushToken')}&enabled=N&sound=N&vibration=N`).subscribe(
              (res: any) => {
                console.log(res);
              }, (err: any) => {
                console.log(err);
              }
            );
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
