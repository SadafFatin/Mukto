import { NationalPnriData, PnriData } from 'src/app/models/pnri_model';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';

@Injectable({
  providedIn: 'root',
})
export class PnriMapAPIService extends APIBaseService {

  namespace = '';
  pnriData: PnriData;
  nationalPnriData: NationalPnriData;

  load(periodStarting): any {
    if (this.pnriData) {
      return {
        data: this.pnriData, ok: true
      };
    }
    else {
      return this.http
        .get(`assets/data/pnri-map.json`)
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


}




