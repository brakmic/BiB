import { TestBed, async, inject } from '@angular/core/testing';
import { AppState } from './app.service';

describe('Service: AppState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppState]
    });
  });

  it('should exist', inject([AppState], (service: AppState) => {
    expect(service).toBeTruthy();
  }));

  it('should return current state', inject([AppState], (service: AppState) => {
       spyOn(service, 'get');
       expect(service.get).not.toHaveBeenCalled();
       service.get();
       expect(service.get).toHaveBeenCalled();
   }));

   it('should be able to set state', inject([AppState], (service: AppState) => {
       spyOn(service, 'set');
       expect(service.set).not.toHaveBeenCalled();
       service.set('myProp', 'MyVal');
       expect(service.set).toHaveBeenCalled();
   }));

   it('should contain a publicly available state property', inject([AppState], (service: AppState) => {
       expect(service.state).toBeTruthy();
   }));

});
