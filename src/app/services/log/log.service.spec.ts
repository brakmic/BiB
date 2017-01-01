import { TestBed, async, inject } from '@angular/core/testing';
import { LogService } from './log.service';
import { ILogEntry } from 'app/interfaces';

describe('Service: Log', () => {
  const entry: ILogEntry = {
    id: '001',
    content: 'test content',
    type: 'info',
    createdAt: new Date().toString(),
    component: 'TestComponent'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService]
    });
  });

  it('should exist', inject([LogService], (service: LogService) => {
    expect(service).toBeTruthy();
  }));

  it('should log a single entry', inject([LogService], (service: LogService) => {
       spyOn(service, 'log');
       expect(service.log).not.toHaveBeenCalled();
       service.log(entry);
       expect(service.log).toHaveBeenCalled();
   }));

   it('should log a single entry [extended]', inject([LogService], (service: LogService) => {
       spyOn(service, 'logEx');
       expect(service.logEx).not.toHaveBeenCalled();
       service.logEx(entry, 'SomeComponent');
       expect(service.logEx).toHaveBeenCalled();
   }));

   it('should log a JSON', inject([LogService], (service: LogService) => {
       spyOn(service, 'logJson');
       expect(service.logJson).not.toHaveBeenCalled();
       service.logJson(entry, 'SomeComponent');
       expect(service.logJson).toHaveBeenCalled();
   }));

   it('should log a table', inject([LogService], (service: LogService) => {
       spyOn(service, 'logTable');
       expect(service.logTable).not.toHaveBeenCalled();
       service.logTable(entry, undefined, undefined);
       expect(service.logTable).toHaveBeenCalled();
   }));

});
