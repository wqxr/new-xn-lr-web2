import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from './xn-input.options';

@Component({
    selector: 'nz-demo-select-search',
    template: `
    <div>
    <nz-select [(ngModel)]="dataValue.value"   (ngModelChange)="changeText($event)" nzShowSearch nzAllowClear  [nzFilterOption]="nzFilterOption" (nzOnSearch)="search($event)" >
      <nz-option *ngFor='let item of list' [nzLabel]="item.text" [nzValue]="item.value"></nz-option>
    </nz-select>
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
export class NzDemoSelectSearchComponent implements OnInit {
    constructor(private xn: XnService, private er: ElementRef) { }
    @Input() row: any;
    @Input() form: FormGroup;
    selectedValue = null;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    dataValue = {
        value: '',
        text: '',
        bankPayType: 0
    };
    public list: Array<{ value: string; text: string; bankPayType?: number }> = [];
    public searchList: Array<{ value: string; text: string, bankPayType?: number }> = [];
    nzFilterOption = () => true;
    ngOnInit() {
        this.dataValue.value = '';
        this.ctrl = this.form.get(this.row.name);

        this.xn.api.post(this.row.options.url, {}).subscribe((x) => {
            if (x.ret === 0) {
                x.data.forEach(x => {
                    this.list.push(
                        {
                            value: x[this.row.options.field[0]],
                            text: x[this.row.options.field[1]],
                            bankPayType: x[this.row.options.field[2]]
                        });
                });
            }

            this.searchList = JSON.parse(JSON.stringify(this.list));
        });
        this.ctrl.valueChanges.subscribe(x => {
            if (x) {
                this.dataValue = JSON.parse(x);
                if (Number(this.dataValue.bankPayType) === 2) {
                    this.row.memo = '';
                } else {
                    this.row.memo = '您无需填写支行信息';
                }

            }
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }
    changeText(value: any) {
        console.log('1111==>', value);
        this.dataValue.value = value;
        const values = this.searchList.filter(x => x.value === value);
        if (values[0].bankPayType === 2) {
            this.row.memo = '';
        } else {
            this.row.memo = '您无需填写支行信息';
        }
        this.ctrl.setValue(JSON.stringify(values[0]));
    }
    search(value: string): void {
        this.list = this.searchList.filter((x) => x.text.includes(value));
    }
}