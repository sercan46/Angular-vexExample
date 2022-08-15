import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[tabsDirective]'
})
export class TabsDirective {

  constructor(private el: ElementRef) {
  }

}
