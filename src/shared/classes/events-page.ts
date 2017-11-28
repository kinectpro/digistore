/**
 * Created by Andrey Okhotnikov on 28.11.17.
 */
import { Events } from "ionic-angular";

export class EventsPage {

  constructor(public events: Events) { }

  ionViewDidEnter() {
    this.events.publish('modalState:changed', true);
  }

  ionViewWillLeave() {
    this.events.publish('modalState:changed', false);
  }
}
