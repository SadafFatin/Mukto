import { SamData } from './../models/sam';
import { NationalPnriData, PnriData } from 'src/app/models/pnri_model';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';

@Injectable({
  providedIn: 'root',
})
export class SamAPIService extends APIBaseService {

  namespace = '';

  load(periodStarting, periodEnding): any {
    return this.http
      .get(`assets/data/sam.json`)
      .pipe(map((results: SamData) =>
        ({ data: results, ok: true })
      )
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();
  }


}




