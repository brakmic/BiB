import { TestBed, async, inject } from '@angular/core/testing';
import { ConsoleService } from './console.service';

describe('Service: Console', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleService]
    });
  });

  it('should exist', inject([ConsoleService], (service: ConsoleService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to log infos', inject([ConsoleService], (service: ConsoleService) => {
       spyOn(service, 'log');
       expect(service.log).not.toHaveBeenCalled();
       service.log('INFO');
       expect(service.log).toHaveBeenCalled();
   }));

   it('should be able to log debug data', inject([ConsoleService], (service: ConsoleService) => {
       spyOn(service, 'debug');
       expect(service.debug).not.toHaveBeenCalled();
       service.debug('DEBUG');
       expect(service.debug).toHaveBeenCalled();
   }));

   it('should be able to log errors', inject([ConsoleService], (service: ConsoleService) => {
       spyOn(service, 'error');
       expect(service.error).not.toHaveBeenCalled();
       service.error('ERROR');
       expect(service.error).toHaveBeenCalled();
   }));

   it('should be able to log warnings', inject([ConsoleService], (service: ConsoleService) => {
       spyOn(service, 'warn');
       expect(service.warn).not.toHaveBeenCalled();
       service.warn('WARNING');
       expect(service.warn).toHaveBeenCalled();
   }));

   it('should be able to log tabular data', inject([ConsoleService], (service: ConsoleService) => {
       spyOn(service, 'table');
       expect(service.table).not.toHaveBeenCalled();
       service.table([{key: 'val'}]);
       expect(service.table).toHaveBeenCalled();
   }));

});
