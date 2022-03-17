import { Directive ,ElementRef ,HostListener} from '@angular/core';

@Directive({
  selector: '[appSkipOtp]'
})
export class SkipOtpDirective {
  element:any;
  constructor(element: ElementRef) {
    this.element = element;
  }

  @HostListener('keydown',['$event']) onkeydown(event:KeyboardEvent){
    return event.keyCode===69 ? false : true
  }

  @HostListener('keyup', ['$event']) onkeyup(tempEvent: KeyboardEvent) {
    let event:any = tempEvent;
    const element = event.srcElement.nextElementSibling;
    if (event.target.value.length === 1) {
      if (element === null) {  // check if its null
        return;
      } else {
        element.focus();
      }   // focus if not null
    }
  }
}
