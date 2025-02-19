// src/app/shared/directives/uppercase-input.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}