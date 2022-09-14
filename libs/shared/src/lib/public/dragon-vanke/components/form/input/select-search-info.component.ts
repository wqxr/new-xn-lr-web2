import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';

@Component({
    selector: 'nz-demo-select-search',
    template: `
    <div [formGroup]="form">
    <nz-select  [formControlName]="row.name" nzShowSearch nzAllowClear  [nzFilterOption]="nzFilterOption" (nzOnSearch)="search($event)" >
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
@DynamicForm({ type: 'select-search', formModule: 'dragon-input' })
export class NzDemoSelectSearchComponent implements OnInit {
    constructor(private xn: XnService) { }
    @Input() row: any;
    @Input() form: FormGroup;
    selectedValue = null;
    ctrl: AbstractControl;
    public list: Array<{ value: string; text: string }> = [];
    public searchList: Array<{ value: string; text: string }> = [];
    nzFilterOption = () => true;
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.xn.dragon.post(this.row.options.url, {}).subscribe((x) => {
            if (x.ret === 0) {
                    x.data.forEach(x => {
                        this.list.push({ value: x[this.row.options.field[0]], text: x[this.row.options.field[1]] });
                        this.searchList.push({ value: x[this.row.options.field[0]], text: x[this.row.options.field[1]] });
                    });

            }
        });
    }
    search(value: string): void {
        // this.ctrl.setValue(value);
        this.list = this.searchList.filter((x) => x.text.includes(value));
    }
}