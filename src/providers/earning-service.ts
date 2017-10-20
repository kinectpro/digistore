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

    constructor(public http: HttpClient, public auth: AuthService) {
      console.log('Init EarningServiceProvider');
    }

    getStatsSalesSummary(): Observable<{[key: string]: any}> {
      return this.http.get(Settings.BASE_URL + this.auth.apiKey + '/json/statsSalesSummary?language=en');
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

    getMonthlyData() {

    }

    getQuarterlyData() {
      return [
        {
          year: 2017,
          quarters: [423523, 23423.23, 3123.00, 1233.22]
        },
        {
          year: 2016,
          quarters: [423523, 23423.23, 3123.00, 1233.22]
        },
        {
          year: 2015,
          quarters: [423523, 23423.23, 3123.00, 1233.22]
        }
      ]
    }

    getYearlyData() {
        return [
            {
                year: 2017,
                amount: 125633.22
            },
            {
                year: 2016,
                amount: 1286733.50
            },
            {
                year: 2015,
                amount: 423523
            }
        ]
    }

}

