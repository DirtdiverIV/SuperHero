import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true,
})
export class UppercaseInputDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.textTransform = 'uppercase';
  }
}
