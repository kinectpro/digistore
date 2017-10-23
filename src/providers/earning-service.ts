/**
 * Created by Andrey Okhotnikov on 20.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class EarningService {

    statsSalesSummary: {[key: string]: any};
    statsSalesMonthly = [];
    statsSalesQuarterly = [];
    statsSalesYearly: any[];
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    quarters: string[] = ['January, February, March', 'April, May, June', 'July, August, September', 'October, November, December'];

    constructor(public http: HttpClient, public auth: AuthService) {
      console.log('Init EarningServiceProvider');
    }

    getStatsSalesSummary(): Observable<{[key: string]: any}> {
      return this.http.get(Settings.BASE_URL + this.auth.apiKey + '/json/statsSalesSummary?language=en');
    }

    getStatsSalesByPeriod(period: string, from: string, to: string): Observable<{[key: string]: any}> {
      return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/statsSales?period=${period}&from=${from}&to=${to}&language=en`);
    }

    getTotal(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesSummary().subscribe(
          res => {
            if (res.result === 'success') {
              this.statsSalesSummary = {
                netto: {
                  total: res.data.for.all.amounts[""].total_netto_amount + 25,
                  today: res.data.for.day.amounts[""].total_netto_amount + 25,
                  week: res.data.for.week.amounts[""].total_netto_amount + 25,
                  month: res.data.for.month.amounts[""].total_netto_amount + 25,
                  year: res.data.for.year.amounts[""].total_netto_amount + 25
                },
                brutto: {
                  total: res.data.for.all.amounts[""].total_brutto_amount,
                  today: res.data.for.day.amounts[""].total_brutto_amount,
                  week: res.data.for.week.amounts[""].total_brutto_amount,
                  month: res.data.for.month.amounts[""].total_brutto_amount,
                  year: res.data.for.year.amounts[""].total_brutto_amount
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

    getMonthlyData(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('month', 'now', '-2Y').subscribe(
          res => {
            if (res.result === 'success') {
              let monthlyTotals = res.data.amounts[""].reverse();
              for (let i = 0; i < monthlyTotals.length; i++) {
                  let date = new Date(monthlyTotals[i].from);
                  let year = date.getFullYear();
                  if (!this.statsSalesMonthly.length || this.statsSalesMonthly[this.statsSalesMonthly.length - 1]['year'] !== year) {
                    // console.log('array is empty or year do not match');
                    this.statsSalesMonthly.push({
                      year: year,
                      months: []
                    });
                  }
                  this.statsSalesMonthly[this.statsSalesMonthly.length - 1]['months'].push({
                    name: this.months[date.getMonth()],
                    netto: monthlyTotals[i].total_netto_amount + 25,
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

    getQuarterlyData(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('quarter', 'now', '-10Y').subscribe(
          res => {
            if (res.result === 'success') {
              let quarterlyTotals = res.data.amounts[""].reverse();
              for (let i = 0; i < quarterlyTotals.length; i++) {
                let date = new Date(quarterlyTotals[i].from);
                let year = date.getFullYear();
                let quarter = Math.floor((date.getMonth() + 3) / 3);
                if (!this.statsSalesQuarterly.length || this.statsSalesQuarterly[this.statsSalesQuarterly.length - 1]['year'] !== year) {
                  // console.log('array is empty or year do not match');
                  this.statsSalesQuarterly.push({
                    year: year,
                    quarters: []
                  });
                }
                this.statsSalesQuarterly[this.statsSalesQuarterly.length - 1]['quarters'].push({
                  number: quarter,
                  name: this.quarters[quarter - 1],
                  netto: quarterlyTotals[i].total_netto_amount + 25,
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

    getYearlyData(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.getStatsSalesByPeriod('year', 'now', '-10Y').subscribe(
          res => {
            if (res.result === 'success') {
              this.statsSalesYearly = res.data.amounts[""].reverse().map(obj => {
                return {
                  "year": (new Date(obj.from)).getFullYear(),
                  "netto": obj.total_netto_amount + 25,
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

