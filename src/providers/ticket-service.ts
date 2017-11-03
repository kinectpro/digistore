/**
 * Created by Andrey Okhotnikov on 03.11.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';

@Injectable()
export class TicketService {

  params: {[key: string]: any} = {};

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init TicketServiceProvider');
  }

  getTicketParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getEticketSettings?language=en`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            this.params.templates = res.data.eticket_templates;
            this.params.locations = res.data.eticket_locations;
            resolve(this.params);
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }
  //
  // getCurrencies(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listCurrencies?language=en`, {
  //       params: new HttpParams().set('no-spinner', 'true')
  //     }).subscribe(
  //       (res: any) => {
  //         if (res.result === 'success') {
  //           this.currencies = res.data.map(obj => obj.code);
  //           resolve(res.data.map(obj => {
  //             return {
  //               'name': obj.name,
  //               'code': obj.code,
  //               'symbol': obj.symbol
  //             }
  //           }));
  //         }
  //         else {
  //           reject(res.message);
  //         }
  //       },
  //       err => reject(err)
  //     );
  //   });
  // }

}

