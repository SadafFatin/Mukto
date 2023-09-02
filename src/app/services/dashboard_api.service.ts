import { PnriData } from 'src/app/models/pnri_model';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardAPIService extends APIBaseService {

  namespace = '';

  load(): any {
    return this.http
      .get(`assets/data/dashboard.json`)
      .pipe(map((results: DashboardAPIService) => ({ data: results, ok: true })
      )
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();
  }

}




