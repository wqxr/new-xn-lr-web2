import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { config } from './config';

@Component({
    selector: 'app-mock-input-index',
    template: `
        <h3>Mock Input Forms</h3>
        <div class="row">
            <div
                class="form-group"
                *ngFor="let row of shows"
                [ngClass]="{
                    oneheight: row.type === 'account-info',
                    twoheight: row.type === 'deal-contract'
                }"
            >
                <div class="col-sm-2 text-right">
                    <label>{{ row.title }}</label
                    ><span class="required-label" *ngIf="row.required">*</span>
                </div>
                <div class="col-sm-10" style="height:auto">
                    <app-dynamic-input
                        [row]="row"
                        [form]="mainForm"
                        [formModule]="formModule"
                        [svrConfig]="svrConfig"
                    ></app-dynamic-input>
                </div>
            </div>
        </div> -->
    `,
    styles: [
        `
            .oneheight {
                height: 250px;
                clear: both;
            }
            .twoheight {
                clear: both;
                height: 200px;
            }
        `
    ]
})
export class MockInputIndexComponent implements OnInit {
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
