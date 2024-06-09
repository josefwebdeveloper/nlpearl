import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";

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
  @ViewChild('contenteditable') contentEditable!: ElementRef<HTMLDivElement>;
  value: string = '';
  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };

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
    if (this.contentEditable) {
      this.contentEditable.nativeElement.contentEditable = (!isDisabled).toString();
    }
  }

  onInput(event: any) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this.contentEditable.nativeElement);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const cursorPos = preCaretRange.toString().length;

      this.value = this.contentEditable.nativeElement.innerText;
      this.onChange(this.value);
      this.highlightPlaceholders();

      this.setCursorPosition(cursorPos);
    }
  }

  setCursorPosition(chars: number) {
    const selection = window.getSelection();
    const range = document.createRange();
    const {node, offset} = this.getTextNode(this.contentEditable.nativeElement, chars);

    if (node) {
      range.setStart(node, offset);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      const {node: lastNode, offset: lastOffset} = this.getLastTextNode(this.contentEditable.nativeElement);
      if (lastNode) {
        range.setStart(lastNode, lastOffset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  getTextNode(element: HTMLElement, chars: number): { node: Node | null, offset: number } {
    let node: Node | null = element;
    let found = false;

    while (node && !found) {
      if (node.nodeType === 3) {  // Text node
        if (chars <= node.textContent!.length) {
          found = true;
        } else {
          chars -= node.textContent!.length;
        }
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          const childNode = node.childNodes[i];
          const result = this.getTextNode(childNode as HTMLElement, chars);
          if (result.node) {
            return result;
          }
        }
      }
      if (!found) {
        node = node.nextSibling;
      }
    }
    return {node: found ? node : null, offset: chars};
  }

  getLastTextNode(element: HTMLElement): { node: Node | null, offset: number } {
    let node: Node | null = element;
    while (node) {
      if (node.nodeType === 3) {  // Text node
        return {node, offset: node.textContent!.length};
      }
      if (node.childNodes.length > 0) {
        node = node.childNodes[node.childNodes.length - 1];
      } else {
        node = node.previousSibling;
      }
    }
    return {node: null, offset: 0};
  }

  insertPlaceholder(placeholder: string) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const placeholderElement = document.createElement('span');
    placeholderElement.classList.add('highlight');
    placeholderElement.textContent = `[${placeholder}]`;
    range.insertNode(placeholderElement);
    range.collapse(false);
    this.onInput(null);
  }

  highlightPlaceholders() {
    if (this.contentEditable) {
      let highlightedContent = this.value;
      this.placeholders.forEach(ph => {
        const regex = new RegExp(`\\[${ph}\\]`, 'g');
        highlightedContent = highlightedContent.replace(regex, `<span class="highlight">[${ph}]</span>`);
      });
      this.contentEditable.nativeElement.innerHTML = highlightedContent;
    }
  }
}
