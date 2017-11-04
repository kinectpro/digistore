/**
 * Created by Andrey Okhotnikov on 26.10.17.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key], num: Object.keys(value).length});
    }
    return keys;
  }
}