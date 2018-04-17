/**
 * Created by Andrey Okhotnikov on 17.04.18.
 */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class StorageService {

  _pushToken: any;
  _sound: boolean;
  _notify: boolean;
  _location: {[key: string]: string};
  _template: {[key: string]: string};

  constructor(public storage: Storage, public events: Events) {
    console.log('Init StorageService');

    this.storage.ready().then( ok => {
      Promise.all([
        this.storage.get('pushToken'),
        this.storage.get('sound'),
        this.storage.get('notify'),
        this.storage.get('location'),
        this.storage.get('template')
      ]).then( results => {
        console.log(results);
        this._pushToken = results[0];
        this._sound = results[1] == null ? true : results[1] == 'Y';
        this._notify = results[2] == null ? true : results[2] == 'Y';
        this._location = results[3];
        this._template = results[4];
      });
    }).catch( err => console.log(err) );

  }

  get pushToken(): any {
    return this._pushToken || null;
  }

  set pushToken(value: any) {
    this.storage.set('pushToken', value);
    this._pushToken = value;
  }

  get sound(): boolean {
    return this._sound;
  }

  set sound(value: boolean) {
    this.storage.set('sound', value ? 'Y' : 'N');
    this.events.publish('send token', false);
    this._sound = value;
  }

  get notify(): boolean {
    return this._notify;
  }

  set notify(value: boolean) {
    this.storage.set('notify', value ? 'Y' : 'N');
    this.events.publish('send token', false);
    this._notify = value;
  }

  get location(): {[key: string]: string} {
    return this._location || { key: '', value: '' };
  }

  set location(value: {[key: string]: string}) {
    this.storage.set('location', value);
    this._location = value;
  }

  get template(): {[key: string]: string} {
    return this._template || { key: '', value: '' };
  }

  set template(value: {[key: string]: string}) {
    this.storage.set('template', value);
    this._template = value;
  }

}