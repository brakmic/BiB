import { Injectable } from '@angular/core';

import { IWindow } from 'app/interfaces';

@Injectable()
export class WindowService implements IWindow {
  public navigator: any = {};
  public location: any = {};
  constructor() {}
  public alert(msg: string): void { return; }
  public confirm(msg: string): void { return; }
}
