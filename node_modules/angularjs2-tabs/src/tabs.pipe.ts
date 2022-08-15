import {Injectable, PipeTransform, Pipe} from '@angular/core';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'tabsPipe'
})
@Injectable()
export class TabsPipe implements PipeTransform {
  transform(value: any, args: any[] = null): string {
    return value;
  }
}
