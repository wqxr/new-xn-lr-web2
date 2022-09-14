import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { config } from './config';
  // 动态表单模块名称

@Component({
    selector: 'app-mock-input-index',
    template: `
        <h3>Mock Show Forms</h3>
        <div class="row">
            <div class="form-group" *ngFor="let row of shows">
                <div class="col-sm-2 text-right">
                    <label>{{ row.title }}</label><span class="required-label" *ngIf="row.required">*</span>
                </div>
                <div class="col-sm-10" style="height:auto">
                    <app-dynamic-show
                        [row]="row"
                        [form]="mainForm"
                        [formModule]="formModule"
                        [svrConfig]="svrConfig"
                    ></app-dynamic-show>
                </div>
            </div>
        </div>
    `
})
export class MockShowIndexComponent implements OnInit {
    public svrConfig: any;

    public mainForm: FormGroup;

    public shows: any[] = config.checks.map((item: any) => ({
        ...item,
        name: item.name || item.checkerId
    }));

    public formModule = config.formModule;

    constructor() {
        //
    }

    ngOnInit(): void {
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }
}
