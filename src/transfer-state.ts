import { Injectable, NgModule, Inject, Optional, Host } from '@angular/core';
import {
  ConnectionBackend,
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

function __transferStateKey(url: string, options: any): string {
  return url + JSON.stringify(options);
}

@Injectable()
export class TransferState {
  static KEY = 'TransferState';
  private _map = new Map<string, any>();

  constructor() {}

  keys() {
    return this._map.keys();
  }

  get(key: string): any {
    return this._map.get(key);
  }

  set(key: string, value: any): Map<string, any> {
    return this._map.set(key, value);
  }

  toJson(): any {
    const obj: any = {};
    this._map.forEach((value: any, key: string, map: Map<string, any>) => obj[key] = value);
    return obj;
  }

  initialize(obj: any): void {
    Object.keys(obj).forEach((key: string) => this.set(key, obj[key]));
  }

  inject(location?: string): void {}
}

type iCallback = (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<Response>;

@Injectable()
export class TransferHttp {
  constructor(private http: Http,
              protected transferState: TransferState,
              @Optional() @Host() @Inject('TransferStateKey') private transferStateKey?: any) {
    if (!this.transferStateKey) {
      this.transferStateKey = __transferStateKey;
    }
  }

  request(uri: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(uri, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.request(url, options);
    });
  }
  /**
   * Performs a request with `get` http method.
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.get(url, options);
    });
  }
  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.post(url, body. options);
    });
  }
  /**
   * Performs a request with `put` http method.
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.put(url, options);
    });
  }
  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.delete(url, options);
    });
  }
  /**
   * Performs a request with `patch` http method.
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.patch(url, body.options);
    });
  }
  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.head(url, options);
    });
  }
  /**
   * Performs a request with `options` http method.
   */
  options(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.options(url, options);
    });
  }

  private getData(uri: string | Request, options: RequestOptionsArgs, callback: iCallback) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = this.transferStateKey(url, options);

    try {
      return this.resolveData(key);

    } catch (e) {
      return callback(uri, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs, callback: iCallback) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = this.transferStateKey(url, options);

    try {

      return this.resolveData(key);

    } catch (e) {
      return callback(uri, body, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private resolveData(key: string) {
    const data = this.getFromCache(key);
    if (!data) {
      throw new Error();
    }
    return Observable.of(data);
  }

  private setCache(key: string, data: any) {
    return this.transferState.set(key, data);
  }

  private getFromCache(key: string): any {
    return this.transferState.get(key);
  }
}

@NgModule({
  providers: [
    TransferHttp
  ]
})
export class TransferHttpModule {}
