/**
 * Created by Andrey Okhotnikov on 20.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class EarningService {

    statsSalesSummary: {[key: string]: any};
    statsSalesMonthly = [];
    statsSalesQuarterly = [];
    statsSalesYearly: any[];
    periods: string[] = ['all', 'day', 'week', 'month', 'year'];
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    quarters: string[] = ['January, February, March', 'April, May, June', 'July, August, September', 'October, November, December'];

    constructor(public http: HttpClient, public auth: AuthService) {
      console.log('Init EarningServiceProvider');
    }

    getStatsSalesSummary(noSpinner: boolean = false): Observable<{[key: string]: any}> {
      return this.http.get(Settings.BASE_URL + this.auth.apiKey + '/json/statsSalesSummary?language=en',  {
        params: new HttpParams().set('no-spinner', noSpinner ? 'true' : ''),
      }).map((res: any) => {
        this.periods.forEach(period => {
          if (!res.data.for[period].amounts.EUR) {
            res.data.for[period].amounts.EUR = {
              total_netto_amount: 0,
              total_brutto_amount: 0
            };
          }
        });
        return res;
      });
    }

    getStatsSalesByPeriod(period: string, from: string, to: string, noSpinner: boolean = false): Observable<{[key: string]: any}> {
      return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/statsSales?period=${period}&from=${from}&to=${to}&language=en`, {
        params: new HttpParams().set('no-spinner', noSpinner ? 'true' : ''),
      }).map((res: any) => {
        res.data.amounts.EUR = res.data.amounts.EUR ? res.data.amounts.EUR.reverse() : [];
        return res;
      });
    }

    getTotal(noSpinner: boolean): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesSummary(noSpinner).subscribe(
          res => {
            if (res.result === 'success') {
              this.statsSalesSummary = {
                netto: {
                  total: res.data.for.all.amounts.EUR.total_netto_amount,
                  today: res.data.for.day.amounts.EUR.total_netto_amount,
                  week: res.data.for.week.amounts.EUR.total_netto_amount,
                  month: res.data.for.month.amounts.EUR.total_netto_amount,
                  year: res.data.for.year.amounts.EUR.total_netto_amount
                },
                brutto: {
                  total: res.data.for.all.amounts.EUR.total_brutto_amount,
                  today: res.data.for.day.amounts.EUR.total_brutto_amount,
                  week: res.data.for.week.amounts.EUR.total_brutto_amount,
                  month: res.data.for.month.amounts.EUR.total_brutto_amount,
                  year: res.data.for.year.amounts.EUR.total_brutto_amount
                }
              };
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
              let monthlyTotals = res.data.amounts.EUR;
              for (let i = 0; i < monthlyTotals.length; i++) {
                  let date = new Date(monthlyTotals[i].from);
                  let year = date.getFullYear();
                  if (!this.statsSalesMonthly.length || this.statsSalesMonthly[this.statsSalesMonthly.length - 1]['year'] !== year) {
                    // if array is empty or year do not match
                    this.statsSalesMonthly.push({
                      year: year,
                      months: []
                    });
                  }
                  this.statsSalesMonthly[this.statsSalesMonthly.length - 1]['months'].push({
                    name: this.months[date.getMonth()],
                    netto: monthlyTotals[i].total_netto_amount,
                    brutto: monthlyTotals[i].total_brutto_amount
                  });
              }
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
              let quarterlyTotals = res.data.amounts.EUR;
              for (let i = 0; i < quarterlyTotals.length; i++) {
                let date = new Date(quarterlyTotals[i].from);
                let year = date.getFullYear();
                let quarter = Math.floor((date.getMonth() + 3) / 3);
                if (!this.statsSalesQuarterly.length || this.statsSalesQuarterly[this.statsSalesQuarterly.length - 1]['year'] !== year) {
                  // if array is empty or year do not match
                  this.statsSalesQuarterly.push({
                    year: year,
                    quarters: []
                  });
                }
                this.statsSalesQuarterly[this.statsSalesQuarterly.length - 1]['quarters'].push({
                  number: quarter,
                  name: this.quarters[quarter - 1],
                  netto: quarterlyTotals[i].total_netto_amount,
                  brutto: quarterlyTotals[i].total_brutto_amount
                });
              }
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
              this.statsSalesYearly = res.data.amounts.EUR.map(obj => {
                return {
                  "year": (new Date(obj.from)).getFullYear(),
                  "netto": obj.total_netto_amount,
                  "brutto": obj.total_brutto_amount
                }
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

