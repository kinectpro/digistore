import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {

  private _apiKey: string;

  constructor() {
    console.log('Hello AuthServiceProvider Provider');
    this._apiKey = localStorage.getItem('api-key') || '';
  }

  get apiKey(): string {
    return this._apiKey;
  }

  set apiKey(value: string) {
    localStorage.setItem('api-key', value);
    this._apiKey = value;
  }

  isLoggedIn(): boolean {
    return this._apiKey !== '';
  }

  logout(): void {
    this._apiKey = '';
    localStorage.clear();
  }

}
