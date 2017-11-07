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

  private _location: {[key: string]: string};
  private _template: {[key: string]: string};

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init TicketServiceProvider');
    this._location = JSON.parse(localStorage.getItem('location')) || { key: '', value: '' };
    this._template = JSON.parse(localStorage.getItem('template')) || { key: '', value: '' };
  }

  get location(): {[key: string]: string} {
    return this._location;
  }
  set location(value: {[key: string]: string}) {
    localStorage.setItem('location', JSON.stringify(value));
    this._location = value;
  }
  get template(): {[key: string]: string} {
    return this._template;
  }
  set template(value: {[key: string]: string}) {
    localStorage.setItem('template', JSON.stringify(value));
    this._template = value;
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
      ticketParams = ticketParams
        .append('location_id', params.location.key)
        .append('template_id', params.template.key)
        .append('eticket_id', params.ticket)
        .append('date', params.date);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/validateEticket?language=en`, { params: ticketParams }).subscribe(
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

  listTickets(params: TicketParams): Promise<any> {
    return new Promise((resolve, reject) => {
      let ticketParams = new HttpParams();
      ticketParams = ticketParams
        .append('search[location_id]', params.location.key)
        .append('search[template_id]', params.template.key)
        .append('search[first_name]', params.firstName || '')
        .append('search[last_name]', params.lastName || '')
        .append('search[email]', params.email || '')
        .append('search[date]', params.date);
      this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listEtickets?language=en`, { params: ticketParams }).subscribe(
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

}

