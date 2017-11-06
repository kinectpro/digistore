/**
 * Created by Andrey Okhotnikov on 03.11.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { TicketParams } from '../models/params';

@Injectable()
export class TicketService {

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init TicketServiceProvider');
  }

  getTicketParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/getEticketSettings?language=en`).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve({
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
      ticketParams = ticketParams.append('location_id', params.location_id.key);
      ticketParams = ticketParams.append('template_id', params.template_id.key);
      ticketParams = ticketParams.append('eticket_id', params.eticket_id);
      ticketParams = ticketParams.append('date', params.date);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/validateEticket?language=en`, {
        params: ticketParams
      }).subscribe(
        (res: any) => {
          if (res.result === 'success') {
            resolve({
              'status': res.data.status,
              'msg': res.data.msg
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

}

