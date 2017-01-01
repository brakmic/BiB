import { TestBed, async, inject } from '@angular/core/testing';
import { HttpEx } from './httpex.service';
import {
    Http,
    ConnectionBackend,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    Headers,
    Request
} from '@angular/http';
import { LogService } from '../log';

describe('Service: HttpEx', () => {

  class LogServiceMock {

    constructor() {
    }

    public logEx(text, component) {
      console.log(`${text} from ${component}`);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          { provide: LogService, useClass: LogServiceMock },
          ConnectionBackend,
          { provide: RequestOptions, useValue: {} },
          HttpEx
      ]
    });
  });

  it('should exist', inject([HttpEx], (service: HttpEx) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to send a request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'request');
       expect(service.request).not.toHaveBeenCalled();
       service.request('http://www.google.com', undefined);
       expect(service.request).toHaveBeenCalled();
   }));

   it('should send a GET-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'get');
       expect(service.get).not.toHaveBeenCalled();
       service.get('http://www.google.com', undefined);
       expect(service.get).toHaveBeenCalled();
   }));

   it('should send a POST-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'post');
       expect(service.post).not.toHaveBeenCalled();
       service.post('http://www.google.com', undefined);
       expect(service.post).toHaveBeenCalled();
   }));

   it('should send a PUT-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'put');
       expect(service.put).not.toHaveBeenCalled();
       service.put('http://www.google.com', undefined);
       expect(service.put).toHaveBeenCalled();
   }));

   it('should send a PATCH-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'patch');
       expect(service.patch).not.toHaveBeenCalled();
       service.patch('http://www.google.com', undefined);
       expect(service.patch).toHaveBeenCalled();
   }));

   it('should send a DELETE-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'delete');
       expect(service.delete).not.toHaveBeenCalled();
       service.delete('http://www.google.com', undefined);
       expect(service.delete).toHaveBeenCalled();
   }));

   it('should send a HEAD-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'head');
       expect(service.head).not.toHaveBeenCalled();
       service.head('http://www.google.com', undefined);
       expect(service.head).toHaveBeenCalled();
   }));

   it('should send an OPTIONS-request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'options');
       expect(service.options).not.toHaveBeenCalled();
       service.options('http://www.google.com', undefined);
       expect(service.options).toHaveBeenCalled();
   }));

   it('should perform a local request', inject([HttpEx], (service: HttpEx) => {
       spyOn(service, 'getLocal');
       expect(service.getLocal).not.toHaveBeenCalled();
       service.getLocal('http://www.google.com', undefined);
       expect(service.getLocal).toHaveBeenCalled();
   }));

});
