/**
 * Created by Andrey Okhotnikov on 23.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';
import { Params } from '../models/params';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TransactionService {

  constructor(public http: HttpClient, public auth: AuthService, public translate: TranslateService) {
    console.log('Init TransactionServiceProvider');
  }

  getTransactionListByPeriod(params: Params, from: string = 'start', to: string = 'now'): Observable<{[key: string]: any}> {
    let params_search = new HttpParams();
    for (let key in params.search) {
      if (params.search[key] && key != 'product_name') {
        if (key === 'from')
          from = params.search[key];
        else if (key === 'to')
          to = params.search[key];
        else
          params_search = params_search.append(`search[${key}]`, params.search[key]);
      }
    }
    return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listPurchases?from=${from}&to=${to}&sort_by=${params.sort.sort_by}&sort_order=${params.sort.sort_order}&${decodeURIComponent(params_search.toString())}&language=${this.translate.currentLang}`);
  }

  getTransactionByOrderId(orderId: string): Observable<{[key: string]: any}> {
    return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getPurchase?purchase_id=${orderId}&language=${this.translate.currentLang}`);
  }

  getTransactionList(period: string, params: Params): Promise<any> {
    return new Promise((resolve, reject) => {
      let from: string;
      let date = new Date();

      switch (period) {
        case 'day':
          from = this.getFormatDate(date);
          break;
        case 'week':
          from = this.getFormatDate(this.getDateAfterSubtractedDays(date, this.getDayOfWeek(date)));  //  get the date for Monday
          break;
        case 'month':
          from = this.getFirstDayOfMonth(date);
          break;
        case 'year':
          from = date.getFullYear() + '-01-01';
          break;
      }

      this.getTransactionListByPeriod(params, from).subscribe(
        res => {
          if (res.result === 'success') {
            resolve(res.data.purchase_list.map(obj => {
              return {
                date: new Date(obj.created_at),
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

  getTransaction(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getTransactionByOrderId(id).subscribe(
        res => {
          if (res.result === 'success') {
            let obj = res.data;
            resolve({
              products: obj.items.map(item => {
                return {
                  name: item.product_name,
                  id: item.product_id
                }
              }),
              order_id: obj.id,
              brutto: obj.amount,
              netto: obj.amount - obj.vat_amount,
              transaction_id: obj.transaction_list[obj.transaction_list.length - 1].id,
              type: obj.transaction_list[obj.transaction_list.length - 1].type,
              method: obj.transaction_list[obj.transaction_list.length - 1].pay_method_msg,
              currency: obj.transaction_list[obj.transaction_list.length - 1].currency,
              customer: {
                name: obj.buyer.first_name + ' ' + obj.buyer.last_name ,
                email: obj.buyer.email,
                phone: obj.buyer.phone_no,
                affiliate: obj.affiliate_name
              }
            });
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

