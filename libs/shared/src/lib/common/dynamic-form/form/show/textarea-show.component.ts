import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';

@Component({
    template: `
    <div style="width:100%">
      <textarea
        rows="5"
        class="form-control xn-show-input-textarea xn-input-font xn-input-border-radius"
        readonly
        >{{ label }}
        </textarea
      >
    </div>
  `,
    styles: [
        `
      .xn-input-border-radius {
        border-style: dashed;
      }

      .xn-show-input-textarea {
        background-color: #ffffff;
        border-style: dashed;
        resize: none;
      }
    `,
    ],
})
@DynamicForm({ type: 'textarea', formModule: 'default-show' })
export class TextareaComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    label = '无';

    constructor() { }

    ngOnInit() {
        this.label = this.row.data;
    }
}
