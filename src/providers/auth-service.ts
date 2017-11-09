import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {

  private _apiKey: string;
  private _lang: string;

  constructor() {
    console.log('Hello AuthServiceProvider Provider');
    this._apiKey = localStorage.getItem('api-key') || '';
    this._lang = localStorage.getItem('lang') || 'de';
  }

  get apiKey(): string {
    return this._apiKey;
  }

  set apiKey(value: string) {
    localStorage.setItem('api-key', value);
    this._apiKey = value;
  }

  get lang(): string {
    return this._lang;
  }

  set lang(value: string) {
    localStorage.setItem('lang', value);
    this._lang = value;
  }

  isLoggedIn(): boolean {
    return this._apiKey !== '';
  }

  logout(): void {
    this._apiKey = '';
    localStorage.clear();
  }

}
