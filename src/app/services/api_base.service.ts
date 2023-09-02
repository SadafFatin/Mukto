/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalProvider } from './global';
import { BaseHelper } from 'src/app/utils/baseHelper';


@Injectable({
  providedIn: 'root',
})
export class APIBaseService {
  constructor(
    public http: HttpClient,
    public g: GlobalProvider,
    private b: BaseHelper,
  ) { }

  getHeader(params = {}) {
    return {
      headers: new HttpHeaders({
        Authorization: this.g.jws,
      }),
      params,
    };
  }
  errorHandle(err) {
    this.b.loadLoading(false);
    let message = err.error ? err.error.message : err.message;
    if (!message) { message = err.error ? err.error : 'unknown error'; }
    this.b.toast(`${err.status}: ${message}`, 5000, `danger`);
  }
}
