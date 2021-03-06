/**
 * Created by Andrey Okhotnikov on 03.11.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { TicketParams } from '../models/params';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TicketService {

  constructor(public http: HttpClient, public auth: AuthService, public translate: TranslateService) {
    console.log('Init TicketServiceProvider');
  }

  getTicketParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getEticketSettings?language=${this.translate.currentLang}`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve({
              owners: res.data.eticket_owners,
              templates: res.data.eticket_templates,
              locations: res.data.eticket_locations
            });
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

  validateTicket(params: TicketParams): Promise<any> {
    return new Promise((resolve, reject) => {
      let ticketParams = new HttpParams();
      ticketParams = ticketParams
        .append('location_id', params.location.key)
        .append('template_id', params.template.key)
        .append('eticket_id', params.ticket)
        .append('date', params.date);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/validateEticket?language=${this.translate.currentLang}`, { params: ticketParams }).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            if (res.data.status == 'failure') resolve({
              'status': 'failure',
              'msg': res.data.msg
            });
            else {
              this.getTicket(params.ticket).then(
                (rez: any) => resolve({
                  'status': 'success',
                  'msg': res.data.msg,
                  'first_name': rez.first_name,
                  'last_name': rez.last_name,
                  'email': rez.email,
                  'download_url': rez.download_url,
                  'mode': ''
                  // 'id': rez.id
                }),
                err => reject(err)
              );
            }
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

  listTickets(params: TicketParams): Promise<any> {
    return new Promise((resolve, reject) => {
      let ticketParams = new HttpParams();
      ticketParams = ticketParams
        .append('search[location_id]', params.location.key)
        .append('search[template_id]', params.template.key)
        .append('search[owner_id]', params.owners || '')
        .append('search[first_name]', params.firstName || '')
        .append('search[last_name]', params.lastName || '')
        .append('search[email]', params.email || '')
        .append('search[date]', params.date);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listEtickets?${decodeURIComponent(ticketParams.toString())}&language=${this.translate.currentLang}`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve(res.data.etickets);
          }
          else {
            reject(res.message);
          }
        },
        err => reject(err)
      );
    });
  }

  getTicket(number: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getEticket?eticket_id=${number}&language=${this.translate.currentLang}`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve(res.data.eticket);
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

