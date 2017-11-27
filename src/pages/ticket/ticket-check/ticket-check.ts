import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, Content, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';

import { TicketSearchResultsPage } from '../ticket-search-results/ticket-search-results';
import { TicketParams } from '../../../models/params';
import { TicketService } from '../../../providers/ticket-service';
import { TicketDetailsPage } from '../ticket-details/ticket-details';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-ticket-check',
  templateUrl: 'ticket-check.html',
})
export class TicketCheckPage {

  private numberForm : FormGroup;
  withoutNumber: boolean;
  params: TicketParams;
  keyboardShowSubscription: Subscription;
  keyboardHideSubscription: Subscription;
  showedError: string = '';

  @ViewChild(Content)
  content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public ticketSrv: TicketService, public fb: FormBuilder,
              public translate: TranslateService, public viewCtrl: ViewController, public keyboard: Keyboard, public events: Events) {
    this.withoutNumber = navParams.get('withoutNumber');
    this.params = navParams.get('params');

    this.keyboardShowSubscription = this.keyboard.onKeyboardShow().subscribe(() => this.content.resize());
    this.keyboardHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.content.resize());

    this.numberForm = fb.group({
      'number': ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(20),
        Validators.pattern('[0-9]+')
      ]]
    });
  }

  ionViewDidLoad() {
    console.log('Init TicketCheckPage');
  }

  ionViewDidEnter() {
    this.events.publish('modalState:changed', true);
  }

  ionViewWillLeave() {
    this.events.publish('modalState:changed', false);
  }

  ionViewDidLeave() {
    this.keyboardShowSubscription.unsubscribe();
    this.keyboardHideSubscription.unsubscribe();
  }

  findWithoutNumber() {
    this.navCtrl.push(TicketCheckPage, { params: this.params, withoutNumber: true });
  }

  checkValid(el: any) {
    if (el.value && el.invalid) {
      this.translate.get("SEARCH_FILTERS_PAGE.INVALID_EMAIL").subscribe( msg => this.showError(msg) );
    }
  }

  showError(mess: string) {
    this.showedError = mess;
    setTimeout(() => {
      this.showedError = '';
    }, 3000);
  }
  
  search() {
    this.navCtrl.push(TicketSearchResultsPage, { params: this.params });
  }

  check() {
    if (this.numberForm.valid) {
      this.params.ticket = this.numberForm.get('number').value;
      this.ticketSrv.validateTicket(this.params).then(
        res => this.navCtrl.push(TicketDetailsPage, { params: this.params, result: res }),
        err => {
          this.navCtrl.push(TicketDetailsPage, {
            params: this.params,
            result: {
              status: 'failure',
              msg: err
            }
          }).then( () => this.viewCtrl.dismiss() );
        }
      );
    }
    else {
      this.translate.get(['E_TICKET_PAGE.20_NUMBER_LIMIT', 'E_TICKET_PAGE.ONLY_DIGITS', 'E_TICKET_PAGE.EMPTY_NUMBER']).subscribe(obj => {
        let msg: string;
        if (this.numberForm.get('number').errors.required)
          msg = obj['E_TICKET_PAGE.EMPTY_NUMBER'];
        else if (this.numberForm.get('number').errors.minlength || this.numberForm.get('number').errors.maxlength)
          msg = obj['E_TICKET_PAGE.20_NUMBER_LIMIT'];
        else {
          msg = obj['E_TICKET_PAGE.ONLY_DIGITS'];
        }

        this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        }).present();
      });
    }
  }

}
