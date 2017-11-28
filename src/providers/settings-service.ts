/**
 * Created by Andrey Okhotnikov on 26.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SettingsService {

  currencies: string[];
  currentCurrency: string;

  constructor(public http: HttpClient, public auth: AuthService, public translate: TranslateService) {
    console.log('Init SettingsServiceProvider');
  }

  getGlobalSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getGlobalSettings?language=${this.translate.currentLang}`).subscribe(
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
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listCurrencies?language=${this.translate.currentLang}`, {
        params: new HttpParams().set('no-spinner', 'true')
      }).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            this.currencies = res.data.map(obj => obj.code);
            resolve(res.data.map(obj => {
              return {
                'name': obj.name,
                'code': obj.code,
                'symbol': obj.symbol
              }
            }));
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

