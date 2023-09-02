import { Injectable } from '@angular/core';

import { map, catchError } from 'rxjs/operators';
import { APIBaseService } from './api_base.service';
import { domain } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAPIService extends APIBaseService {
  namespace = 'api';
  async list(params = {}) {
    const options = { ...this.getHeader(), params };
    const url = `${domain}/${this.namespace}/list`;
    return this.http.get(url, options).pipe(
      map(results => results),
      catchError(error => {
        this.errorHandle(error);
        return Promise.resolve({ ok: false });
      })
    );
  }

  async add(data) {
    const url = `${domain}/${this.namespace}/add`;
    return this.http.post(url, data, this.getHeader()).pipe(
      map(results => results),
      catchError(error => {
        this.errorHandle(error);
        return Promise.resolve({ ok: false });
      })
    );
  }

  async get(id) {
    const url = `${domain}/${this.namespace}/${id}/get`;
    return this.http.get(url, this.getHeader()).pipe(
      map(results => results),
      catchError(error => {
        this.errorHandle(error);
        return Promise.resolve({ ok: false });
      })
    );
  }


  async update(id, model) {
    const url = `${domain}/${this.namespace}/${id}/update`;
    return this.http.post(url, model, this.getHeader()).pipe(
      map(results => results),
      catchError(error => {
        this.errorHandle(error);
        return Promise.resolve({ ok: false });
      })
    );
  }
}
