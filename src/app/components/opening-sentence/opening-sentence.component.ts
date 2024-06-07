import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgForOf } from "@angular/common";

@Component({
  selector: 'app-opening-sentence',
  standalone: true,
  imports: [
    NgForOf, CommonModule, ReactiveFormsModule
  ],
  templateUrl: './opening-sentence.component.html',
  styleUrls: ['./opening-sentence.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OpeningSentenceComponent),
      multi: true
    }
  ]
})
export class OpeningSentenceComponent implements ControlValueAccessor, OnInit {
  @Input() placeholders: string[] = [];
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  value: string = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    this.highlightPlaceholders();
  }

  writeValue(value: any): void {
    this.value = value;
    this.highlightPlaceholders();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (!this.textarea) return;
    this.textarea.nativeElement.disabled = isDisabled;
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.highlightPlaceholders();
  }

  insertPlaceholder(placeholder: string) {
    const cursorPos = this.textarea.nativeElement.selectionStart;
    const textBefore = this.value.substring(0, cursorPos);
    const textAfter = this.value.substring(cursorPos, this.value.length);
    this.value = `${textBefore}[${placeholder}]${textAfter}`;
    this.onChange(this.value);
    this.highlightPlaceholders();
  }

  highlightPlaceholders() {
    if (this.textarea) {
      const content = this.value;
      let highlightedContent = content;
      this.placeholders.forEach(ph => {
        const regex = new RegExp(`\\[${ph}\\]`, 'g');
        highlightedContent = highlightedContent.replace(regex, `<span class="highlight">[${ph}]</span>`);
      });
      this.textarea.nativeElement.innerHTML = highlightedContent;
    }
  }
}
