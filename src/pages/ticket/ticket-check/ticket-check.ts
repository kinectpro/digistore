import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TicketSearchResultsPage } from '../ticket-search-results/ticket-search-results';
import { TicketParams } from '../../../models/params';
import { TicketService } from '../../../providers/ticket-service';
import { TicketDetailsPage } from '../ticket-details/ticket-details';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-ticket-check',
  templateUrl: 'ticket-check.html',
})
export class TicketCheckPage {

  private numberForm : FormGroup;
  withoutNumber: boolean;
  params: TicketParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public ticketSrv: TicketService, public fb: FormBuilder) {
    this.withoutNumber = navParams.get('withoutNumber');
    this.params = navParams.get('params');

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
    console.log('ionViewDidLoad TicketCheckPage');
  }

  findWithoutNumber() {
    this.navCtrl.push(TicketCheckPage, { params: this.params, withoutNumber: true });
  }

  search() {
    this.navCtrl.push(TicketSearchResultsPage, { params: this.params });
  }

  check() {
    if (this.numberForm.valid) {
      this.params.ticket = this.numberForm.get('number').value;
      this.ticketSrv.validateTicket(this.params).then(
        res => this.navCtrl.push(TicketDetailsPage, { params: this.params, result: res }),
        err => console.log(err)
      );
    }
    else {
      let msg: string;
      if (this.numberForm.get('number').errors.required)
        msg = 'Not entered E-Ticket number!';
      else if (this.numberForm.get('number').errors.minlength || this.numberForm.get('number').errors.maxlength)
        msg = 'E-Ticket number must be 20 symbols!';
      else {
        msg = 'E-Ticket number must include only digits!';
      }

      this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      }).present();

    }
  }

}
