import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';
import { domain } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImpactAPIService extends APIBaseService {

  namespace = '';

  load(): any {

    return this.http
      .get('assets/data/impacts.json')
      .pipe(map((results) => ({ data: results, ok: true }))
        , catchError((error) => {
          this.errorHandle(error);
          return Promise.resolve({ ok: false });
        })).toPromise();

  }



}




