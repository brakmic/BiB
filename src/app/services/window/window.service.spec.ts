import { TestBed, async, inject } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('Service: Window', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WindowService, useValue: window }]
    });
  });

  it('should exist', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));

  it('should contain the navigator object', inject([WindowService], (service: WindowService) => {
       expect(service.navigator).not.toBeFalsy();
   }));

   it('should contain the location object', inject([WindowService], (service: WindowService) => {
       expect(service.location).not.toBeFalsy();
   }));

   it('should be able to show an alert popup', inject([WindowService], (service: WindowService) => {
       spyOn(service, 'alert');
       expect(service.alert).not.toHaveBeenCalled();
       service.alert('alert!');
       expect(service.alert).toHaveBeenCalled();
   }));

   it('should be able to show a confirm poput', inject([WindowService], (service: WindowService) => {
       spyOn(service, 'confirm');
       expect(service.confirm).not.toHaveBeenCalled();
       service.confirm('confirm!');
       expect(service.confirm).toHaveBeenCalled();
   }));
});
