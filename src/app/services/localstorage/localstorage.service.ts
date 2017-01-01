import { Injectable } from '@angular/core';
const circularJson = require('circular-json');

@Injectable()
export class LocalStorageService {

  private localStorage: any;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  public set(key: string, value: string): void {
    this.localStorage[key] = value;
  }

  public get(key: string): string {
    return this.localStorage[key] || false;
  }

  public setArray(key: string, value: any): void {
    this.localStorage[key] = circularJson.stringify(value);
  }

  public getArray(key: string): any {
    return circularJson.parse(this.localStorage[key] || '[]');
  }

  public setObject(key: string, value: any): void {
    this.localStorage[key] = circularJson.stringify(value);
  }

  public getObject(key: string): any {
    return circularJson.parse(this.localStorage[key] || '{}');
  }
}
