import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  loadingText: string;

  constructor(public loadingCtrl: LoadingController, public inj: Injector) {
    console.log('LoadingInterceptor Init');
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let cameTheResponse: boolean = false;

    this.inj.get(TranslateService).get('LOADING_TEXT').subscribe(value => this.loadingText = value);

    let loading = this.loadingCtrl.create({
      content: this.loadingText,
      spinner: 'dots'
    });
    
    if (req.params.has('no-spinner') || req.url.includes('i18n')) {
      req = req.clone({params: req.params.delete('no-spinner')});
    }
    else {
      setTimeout(()=> {
        if (!cameTheResponse) {
          loading.present();
        }
      }, 1000);
    }

    return next.handle(req).do(
      event => {
        if (event instanceof HttpResponse) {
          cameTheResponse = true;
          loading.dismiss();
        }
      },
      err => {
        cameTheResponse = true;
        loading.dismiss();
      }
    );
  }

}
