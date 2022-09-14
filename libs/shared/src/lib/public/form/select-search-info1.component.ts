import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from './xn-input.options';

@Component({
    selector: 'nz-demo-select-search1',
    template: `
    <div class="example-input" [formGroup]="form">
    <input  class="form-control xn-input-font xn-input-border-radius"  [formControlName]="row.name" [placeholder]="defaultValue" (input)='changeValue($event)' nz-input  [nzAutocomplete]="auto" />
    <nz-autocomplete #auto [compareWith]="compareFun">
      <nz-auto-option *ngFor="let option of list" [nzValue]="option.value" [nzLabel]="option.value">
        {{ option.text }}
      </nz-auto-option>
    </nz-autocomplete>
  </div>
  `,
    styles: [
        `
        nz-select {
        width: 100%;
      }
    `
    ]
})
export class NzDemoSelectSearchMoreComponent implements OnInit {
    constructor(private xn: XnService, private er: ElementRef) { }
    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    defaultValue: string;
    xnOptions: XnInputOptions;
    public list: Array<{ value: string; text: string; bankPayType?: number }> = [];
    public searchList: Array<{ value: string; text: string, bankPayType?: number }> = [];
    // nzFilterOption = () => true;
    inputValue: Option = { text: '', value: '' };
    bankId: string;
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.defaultValue = this.row.options.placeholder;
        this.form.get('bankInfo').valueChanges.subscribe((x) => {
            if (!!x) {
                if (Number(JSON.parse(x).bankPayType) === 2) {
                    const bankId = JSON.parse(x).value;
                    this.bankId = bankId;
                    this.ctrl.setValue('');
                    this.getUnionlist(bankId, '');
                }
            }
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }

    getUnionlist(bankIds: string, searchs: string) {
        this.list = [];
        this.xn.api.post(this.row.options.url, { bankId: bankIds, search: searchs }).subscribe((x) => {
            if (x.ret === 0) {
                x.data.forEach(x => {
                    this.list.push({ value: x[this.row.options.field[0]], text: x[this.row.options.field[1]] });
                });
            }
            this.searchList = JSON.parse(JSON.stringify(this.list));
        });
    }

    changeValue($event) {
        this.getUnionlist(this.bankId, $event.target.value);
    }
    compareFun = (o1: Option | string, o2: Option) => {
        if (o1) {
            return typeof o1 === 'string' ? o1 === o2.text : o1.value === o2.value;
        } else {
            return false;
        }
    };
}
interface Option {
    text: string;
    value: string;
}