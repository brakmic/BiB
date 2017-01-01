import { Injectable } from '@angular/core';
import { Http, Headers, 
         RequestOptions, Request } from '@angular/http';
import { bibApi } from 'app/apis';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';

@Injectable()
export class UploadService {
  constructor (private http: Http) {
  }

  public uploadFile(url: string, files: FileList): Observable<any> {
    if(files.length > 0) {
            let file: File = files[0];
            let formData:FormData = new FormData();
            formData.append('file', file, file.name);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            return this.http.post(`${bibApi.isbnUrl}`, formData, options).map(result => {
                return result.json();
            });
        }
        return Observable.from([]);
    }
}
