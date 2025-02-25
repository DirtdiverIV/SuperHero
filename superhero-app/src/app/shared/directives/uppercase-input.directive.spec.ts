import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UppercaseInputDirective } from './uppercase-input.directive';

@Component({
  template: `<input appUppercaseInput />`,
})
class TestComponent {}

describe('UppercaseInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],

      imports: [UppercaseInputDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance of the directive', () => {
    const directive = fixture.debugElement.query(
      By.directive(UppercaseInputDirective)
    );
    expect(directive).toBeTruthy();
  });

  it('should apply the text-transform style to uppercase', () => {
    expect(inputEl.style.textTransform).toBe('uppercase');
  });

  it('should not modify the actual value of the input', () => {
    (inputEl as HTMLInputElement).value = 'test';
    inputEl.dispatchEvent(new Event('input'));

    expect((inputEl as HTMLInputElement).value).toBe('test');
  });
});
