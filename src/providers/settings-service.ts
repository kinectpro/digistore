/**
 * Created by Andrey Okhotnikov on 26.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';

@Injectable()
export class SettingsService {

  currencies: string[];

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init SettingsServiceProvider');
  }

  getGlobalSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getGlobalSettings?language=en`, {
        params: new HttpParams().set('no-spinner', 'true')
      }).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve(res.data.types);
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

  getCurrencies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listCurrencies?language=en`, {
        params: new HttpParams().set('no-spinner', 'true')
      }).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            this.currencies = res.data.map(obj => obj.code);
            resolve(this.currencies);
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

}

