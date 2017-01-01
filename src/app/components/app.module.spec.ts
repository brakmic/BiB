import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app/app.component';
import { AppState, LogService } from '../services';
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMON_TESTING_PROVIDERS } from 'app/base';

describe('Module : App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ...COMMON_TESTING_PROVIDERS,
      { provide: ActivatedRoute, useValue: {} },
      { provide: Router, useValue: {} },
      ApplicationRef,
      App
    ]}));

  it('should be initialized', inject([ App ], (app: App) => {
    expect(app).toBeTruthy();
  }));

});
