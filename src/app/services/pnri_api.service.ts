import { NationalPnriData, PnriData } from 'src/app/models/pnri_model';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';

@Injectable({
  providedIn: 'root',
})
export class PnriAPIService extends APIBaseService {

  namespace = '';
  pnriData: PnriData;
  nationalPnriData: NationalPnriData;

  load(periodStarting, periodEnding?): any {
    if (this.pnriData) {
      return {
        data: this.pnriData, ok: true
      };
    }
    else {
      return this.http
        .get(`assets/data/pnri.json`)
        .pipe(map((results: PnriData) => {
          this.pnriData = results;
          return {
            data: results, ok: true
          };
        }
        )
          , catchError((error) => {
            this.errorHandle(error);
            return Promise.resolve({ ok: false });
          })).toPromise();
    }
  }

  loadNational(period): any {
    if (this.nationalPnriData) {
      return {
        data: this.nationalPnriData, ok: true
      };
    }
    else {
      return this.http
        .get('assets/data/national.json')
        .pipe(map((results: NationalPnriData) => {
          this.nationalPnriData = results;
          return { data: results, ok: true };
        })
          , catchError((error) => {
            this.errorHandle(error);
            return Promise.resolve({ ok: false });
          })).toPromise();
    }

  }


}




