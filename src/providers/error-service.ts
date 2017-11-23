import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorService {

  constructor(public alertCtrl: AlertController, public translate: TranslateService) {
    console.log('Init ErrorServiceProvider');
  }

  showMessage(err: any) {

    if (err instanceof HttpErrorResponse) {
      this.translate.get(['LOGIN_PAGE.CONNECTION_PROBLEM', 'NET_ERROR']).subscribe( obj => this.createAlert(obj['LOGIN_PAGE.CONNECTION_PROBLEM'], obj['NET_ERROR']));
      return;
    }

    this.translate.get('ERROR').subscribe( val => this.createAlert(val, err));
  }

  createAlert(title, mess) {
    this.alertCtrl.create({
      mode: 'ios',
      title: title,
      message: mess,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => console.log('OK')
        }
      ]
    }).present();
  }

}

