/**
 * Created by Andrey Okhotnikov on 20.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';
import { SettingsService } from './settings-service';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';


@Injectable()
export class EarningService {

    currentPeriod: string;
    statsSalesSummary: {[key: string]: any} = {};
    statsSalesMonthly: {[key: string]: any} = {};
    statsSalesQuarterly: {[key: string]: any} = {};
    statsSalesYearly: {[key: string]: any} = {};
    periods: string[] = ['all', 'day', 'week', 'month', 'year'];
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    quarters: string[] = ['January, February, March', 'April, May, June', 'July, August, September', 'October, November, December'];

    constructor(public http: HttpClient, public auth: AuthService, public settingsServ: SettingsService, public translate: TranslateService) {
      console.log('Init EarningServiceProvider');
    }

    getStatsSalesSummary(noSpinner: boolean = false): Observable<{[key: string]: any}> {
      return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/statsSalesSummary?language=${this.translate.currentLang}`,  {
        params: new HttpParams().set('no-spinner', noSpinner ? 'true' : ''),
      }).map((res: any) => {
        this.periods.forEach(period => {
          this.settingsServ.currencies.forEach(currency => {
            if (!res.data.for[period].amounts[currency]) {
              res.data.for[period].amounts[currency] = {
                total_netto_amount: 0,
                total_brutto_amount: 0
              };
            }
          });
        });
        return res;
      });
    }

    getStatsSalesByPeriod(period: string, from: string, to: string, noSpinner: boolean = false): Observable<{[key: string]: any}> {
      return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/statsSales?period=${period}&from=${from}&to=${to}&language=${this.translate.currentLang}`, {
        params: new HttpParams().set('no-spinner', noSpinner ? 'true' : ''),
      }).map((res: any) => {
        this.settingsServ.currencies.forEach(currency => {
          res.data.amounts[currency] = res.data.amounts[currency] ? res.data.amounts[currency].reverse() : [];
        });

        return res;
      });
    }

    getTotal(noSpinner: boolean): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesSummary(noSpinner).subscribe(
          res => {
            if (res.result === 'success') {
              this.settingsServ.currencies.forEach(currency => {
                this.statsSalesSummary[currency] = {
                  netto: {
                    total: res.data.for.all.amounts[currency].total_netto_amount,
                    today: res.data.for.day.amounts[currency].total_netto_amount,
                    week: res.data.for.week.amounts[currency].total_netto_amount,
                    month: res.data.for.month.amounts[currency].total_netto_amount,
                    year: res.data.for.year.amounts[currency].total_netto_amount
                  },
                  brutto: {
                    total: res.data.for.all.amounts[currency].total_brutto_amount,
                    today: res.data.for.day.amounts[currency].total_brutto_amount,
                    week: res.data.for.week.amounts[currency].total_brutto_amount,
                    month: res.data.for.month.amounts[currency].total_brutto_amount,
                    year: res.data.for.year.amounts[currency].total_brutto_amount
                  }
                };
              });
              resolve(this.statsSalesSummary);
            }
            else {
              reject(res.message);
            }
          },
          err => {
            reject(err);
          });
      });
    }

    getMonthlyData(noSpinner: boolean): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('month', 'now', '2010-01-01', noSpinner).subscribe(
          res => {
            if (res.result === 'success') {

              this.statsSalesMonthly = {};

              this.settingsServ.currencies.forEach(currency => {

                let monthlyTotals = res.data.amounts[currency];
                for (let i = 0; i < monthlyTotals.length; i++) {
                  let date = new Date(monthlyTotals[i].from);
                  let year = date.getFullYear();
                  if (!this.statsSalesMonthly[currency]) {
                    this.statsSalesMonthly[currency] = [];
                  }
                  if (!this.statsSalesMonthly[currency].length || this.statsSalesMonthly[currency][this.statsSalesMonthly[currency].length - 1]['year'] !== year) {
                    // if array is empty or year do not match
                    this.statsSalesMonthly[currency].push({
                      year: year,
                      months: []
                    });
                  }
                  this.statsSalesMonthly[currency][this.statsSalesMonthly[currency].length - 1]['months'].push({
                    name: this.months[date.getMonth()],
                    netto: monthlyTotals[i].total_netto_amount,
                    brutto: monthlyTotals[i].total_brutto_amount
                  });
                }

              });

              resolve(this.statsSalesMonthly);
            }
            else {
              reject(res.message);
            }
          },
          err => {
            reject(err);
          });
      });
    }

    getQuarterlyData(noSpinner: boolean): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('quarter', 'now', '2010-01-01', noSpinner).subscribe(
          res => {
            if (res.result === 'success') {

              this.statsSalesQuarterly = {};

              this.settingsServ.currencies.forEach(currency => {

                let quarterlyTotals = res.data.amounts[currency];
                for (let i = 0; i < quarterlyTotals.length; i++) {
                  let date = new Date(quarterlyTotals[i].from);
                  let year = date.getFullYear();
                  let quarter = Math.floor((date.getMonth() + 3) / 3);
                  if (!this.statsSalesQuarterly[currency]) {
                    this.statsSalesQuarterly[currency] = [];
                  }
                  if (!this.statsSalesQuarterly[currency].length || this.statsSalesQuarterly[currency][this.statsSalesQuarterly[currency].length - 1]['year'] !== year) {
                    // if array is empty or year do not match
                    this.statsSalesQuarterly[currency].push({
                      year: year,
                      quarters: []
                    });
                  }
                  this.statsSalesQuarterly[currency][this.statsSalesQuarterly[currency].length - 1]['quarters'].push({
                    number: quarter,
                    name: this.quarters[quarter - 1],
                    netto: quarterlyTotals[i].total_netto_amount,
                    brutto: quarterlyTotals[i].total_brutto_amount
                  });
                }

              });

              resolve(this.statsSalesQuarterly);
            }
            else {
              reject(res.message);
            }
          },
          err => {
            reject(err);
          });
      });
    }

    getYearlyData(noSpinner: boolean): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('year', 'now', '2010-01-01', noSpinner).subscribe(
          res => {
            if (res.result === 'success') {
              this.settingsServ.currencies.forEach(currency => {
                this.statsSalesYearly[currency] = res.data.amounts[currency].map(obj => {
                  return {
                    "year": (new Date(obj.from)).getFullYear(),
                    "netto": obj.total_netto_amount,
                    "brutto": obj.total_brutto_amount
                  }
                });
              });
              resolve(this.statsSalesYearly);
            }
            else {
              reject(res.message);
            }
          },
          err => {
            reject(err);
          });
      });
    }

}

