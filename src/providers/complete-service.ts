/**
 * Created by Andrey Okhotnikov on 31.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../config/settings';
import { AuthService } from './auth-service';
import { AutoCompleteService } from 'ionic2-auto-complete';
import 'rxjs/add/operator/map';

@Injectable()
export class CompleteService implements AutoCompleteService {

  labelAttribute = "name";

  constructor(public http: HttpClient, public auth: AuthService) {
    console.log('Init CompleteServiceProvider');
  }

  getResults(keyword:string) {
    return this.http.get(`${Settings.BASE_URL}${this.auth.apiKey}/json/listProducts?language=en`, {
      params: new HttpParams().set('no-spinner', 'true')
    }).map((res: any) => {
      return res.data.products.filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) );
    });
  }

}

