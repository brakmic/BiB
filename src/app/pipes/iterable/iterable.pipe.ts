// original taken from: https://gist.github.com/amcdnl/202596c5b85cc66d7002d10bde3ab514
import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
const cuid = require('cuid');
/**
 * Iterable Pipe
 *
 * It accepts Objects and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *
 * Example:
 *
 *  <div *ngFor="let keyValuePair of someObject | iterable">
 *    key {{keyValuePair.key}} and value {{keyValuePair.value}}
 *  </div>
 *
 */
@Pipe({
      name: 'iterable'
})
export class IterablePipe implements PipeTransform {
    transform(iterable: any, args: any[]): any {
        let result = [];
        _.forOwn(iterable, (value, key) => {
             result.push({key: key, value: value, id: cuid() });
        });
        return result;
    }
}