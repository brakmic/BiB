import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorageService } from './localstorage.service';

describe('Service: LocalStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
  });

  it('should exist', inject([LocalStorageService], (service: LocalStorageService) => {
    expect(service).toBeTruthy();
  }));

  it('should get a key', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'get');
       expect(service.get).not.toHaveBeenCalled();
       service.get('myKey');
       expect(service.get).toHaveBeenCalled();
   }));

   it('should set a key', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'set');
       expect(service.set).not.toHaveBeenCalled();
       service.set('myKey', 'myvalue');
       expect(service.set).toHaveBeenCalled();
   }));

   it('should get an array', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'getArray');
       expect(service.getArray).not.toHaveBeenCalled();
       service.getArray('myArray');
       expect(service.getArray).toHaveBeenCalled();
   }));

   it('should set an array', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'setArray');
       expect(service.setArray).not.toHaveBeenCalled();
       service.setArray('myArray', [1, 2, 3, 4, 5]);
       expect(service.setArray).toHaveBeenCalled();
   }));

   it('should get an object', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'getObject');
       expect(service.getObject).not.toHaveBeenCalled();
       service.getObject('myObject');
       expect(service.getObject).toHaveBeenCalled();
   }));

   it('should set an object', inject([LocalStorageService], (service: LocalStorageService) => {
       spyOn(service, 'setObject');
       expect(service.setObject).not.toHaveBeenCalled();
       service.setObject('myObject', { prop1: 'val1', prop2: 'val2'});
       expect(service.setObject).toHaveBeenCalled();
   }));

});
