/**
 * Created by Andrey Okhotnikov on 20.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TransactionService {

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init TransactionServiceProvider');
  }

  getTransactionListByPeriod(from: string = 'start', to: string = 'now'): Observable<{[key: string]: any}> {
    return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listPurchases?from=${from}&to=${to}&sort_order=desc&language=en`);
  }

  getTransactions(period: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let from: string;
      let date = new Date();

      if (period === 'day') {
        from = this.getFormatDate(date);
      }
      else if (period === 'week') {
        from = this.getFormatDate(this.getDateAfterSubtractedDays(date, this.getDayOfWeek(date)));  //  get the date for Monday
      }
      else if (period === 'month') {
        from = this.getFirstDayOfMonth(date);
      }
      else if (period === 'year') {
        from = date.getFullYear() + '-01-01';
      }

      this.getTransactionListByPeriod(from).subscribe(
        res => {
          if (res.result === 'success') {
            resolve(res.data.purchase_list.map(obj => {
              return {
                date: obj.created_at,
                name: obj.main_product_name,
                order_id: obj.id,
                earning: obj.amount - obj.vat_amount
              }
            }));
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

  /**
   * The method returns the date in the format YYYY-MM-DD
   * @param date
   * @returns {string}
   */
  getFormatDate(date): string {

    let DD = date.getDate();
    if (DD < 10) DD = '0' + DD;

    let MM = date.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;

    let YYYY = date.getFullYear();

    return YYYY + '-' + MM + '-' + DD;
  }

  /**
   * The method returns the first day of month in the format YYYY-MM-DD
   * @param date
   * @returns {string}
   */
  getFirstDayOfMonth(date): string {
    let MM = date.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;

    return date.getFullYear() + '-' + MM + '-01';
  }

  /**
   * The method returns the day of the week starting at zero (Monday)
   * @param date
   * @returns {number}
   */
  getDayOfWeek(date): number {

    let day = date.getDay();
    if (day == 0) { // day 0 becomes 7
      day = 7;
    }

    return day - 1;
  }

  /**
   * The method returns a date that decreases by the specified number of days
   * @param date - Date
   * @param days - number of days
   */
  getDateAfterSubtractedDays(date: Date, days: number): Date {
    let dateCopy = new Date(date);

    dateCopy.setDate(date.getDate() - days);
    return dateCopy;
  }
}

