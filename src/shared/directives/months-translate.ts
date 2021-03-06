import { Directive, AfterViewInit, HostListener, ElementRef, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[months-translate]',
})
export class MonthsTranslateDirective implements AfterViewInit {

  @Input("months-translate") date: string;
  title: HTMLElement;
  currentDate: Date;

  constructor(public el: ElementRef, public translate: TranslateService) {
    console.log('Init MonthsTranslateDirective');
    this.translate.onLangChange.subscribe(() => this.setTitleCalendar(this.currentDate));
  }

  ngAfterViewInit() {
    this.title = this.el.nativeElement.querySelector('ion-calendar .title .switch-btn');
    this.setTitleCalendar(new Date(this.date));
  }

  @HostListener("monthChange", [ '$event' ])
  monthChange(event) {
    this.setTitleCalendar(event.newMonth.dateObj);
  }

  private setTitleCalendar(date: Date): void {
    this.currentDate = date;
    this.title.innerHTML = date.toLocaleString(this.translate.currentLang, { month: "long", year: "numeric" });
  }

}
