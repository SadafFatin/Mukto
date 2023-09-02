import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';
import { domain } from 'src/environments/environment';
import { ScorecardApiResponse } from '../pages/scorecard/scorecard';

@Injectable({
  providedIn: 'root',
})
export class ScorecardAPIService extends APIBaseService {

  namespace = '';
  load(periodStart: any, periodEnding: any): Promise<any> {

    return this.http
      .get('assets/data/scorecard.json')
      .pipe(map((results) => ({ data: results, ok: true, message: '' }))
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();

  }

  loadDli(periodStart: any, periodEnding: any): Promise<any> {

    return this.http
      .get('assets/data/dli.json')
      .pipe(map((results) => ({ data: results, ok: true, message: '' }))
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();

  }

  loadCC(upazila): Promise<any> {

    return this.http
      .get('assets/data/cc.json')
      .pipe(map((results) => ({ data: results, ok: true, message: '' }))
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();

  }


}




