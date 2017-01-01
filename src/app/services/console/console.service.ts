import { Injectable } from '@angular/core';

import { IConsole } from 'app/interfaces';

@Injectable()
export class ConsoleService implements IConsole {

  constructor() {}

  public log(m: any): void { return; }
  public debug(m: any): void { return; }
  public error(m: any): void { return; }
  public warn(m: any): void { return; }
  public info(m: any): void { return; }
  public table(m: any): void { return; }

}
