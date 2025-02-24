import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UppercaseInputDirective } from './uppercase-input.directive';

@Component({
  template: `<input appUppercaseInput>`
})
class TestComponent {}

describe('UppercaseInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UppercaseInputDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = new UppercaseInputDirective(null as any);
    expect(directive).toBeTruthy();
  });

  it('should convert input text to uppercase', () => {
    inputEl.value = 'test';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('TEST');
  });

  it('should handle empty input', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('');
  });

  it('should handle already uppercase input', () => {
    inputEl.value = 'ALREADY UPPERCASE';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('ALREADY UPPERCASE');
  });
});