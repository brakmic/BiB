/**
 * A demo pipe. Not in use.
 * @type {Pipe}
 */
import { Pipe, PipeTransform } from '@angular/core';
const bows = require('platform/helpers/bows-alt');
const log = bows('TestPipe');

@Pipe({
  name: 'testPipe'
})
export class TestPipe implements PipeTransform {
  constructor() {

  }
  public transform(value: string, args: string[]): string {
    log(`VALUE: ${value}, ARGS: ${args}`);
    return 'Piped Value!';
  }
}
