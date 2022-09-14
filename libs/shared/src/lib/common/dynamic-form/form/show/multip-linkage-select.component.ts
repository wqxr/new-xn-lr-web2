import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
/**
 *  多级(3级)联动选择
 *  return {first: '', second: '', third: ''}
 */
@Component({
    selector: 'lib-multip-linkage-select-show',
    template: `
    <div class="row">
    <div class="col-md-4 xn-mselect-right">
        <select class="form-control xn-input-font" [(ngModel)]="selectModel.first" disabled="true">
        <option value="">-请选择-</option>
        <option *ngFor="let firstOption of row.selectOptions" value="{{firstOption.value}}">{{firstOption.label}}</option>
        </select>
    </div>
    <div class="col-md-4 xn-mselect-right xn-mselect-left">
        <select class="form-control xn-input-font" [(ngModel)]="selectModel.second" disabled="true">
        <option value="">-请选择-</option>
        <option *ngFor="let secondOption of secondOptions" value="{{secondOption.value}}">{{secondOption.label}}</option>
        </select>
    </div>
    <div class="col-md-4 xn-mselect-left">
        <select class="form-control xn-input-font" [(ngModel)]="selectModel.third" disabled="true">
        <option value="">-请选择-</option>
        <option *ngFor="let thirdOption of thirdOptions" value="{{thirdOption.value}}">{{thirdOption.label}}</option>
        </select>
    </div>
    </div>
    `,
    styles: [
        `.xn-mselect-right {
            padding-right: 2px;
        }
        .xn-mselect-left {
            padding-left: 2px;
        }`
    ]
})
@DynamicForm({ type: 'multip-linkage-select', formModule: 'default-show' })
export class MultipLinkageSelectShowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    selectModel: {
        first: number | string,
        second: number | string,
        third: number | string,
    } = {
        first: '',
        second: '',
        third: '',
    };
    secondOptions: any[] = [];
    thirdOptions: any[] = [];

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        // 设置初始值
        if (!!this.row.data) {
            // {first: '', second: '', third: ''}
            const valObj = XnUtils.parseObject(this.row.data);
            const secondObj = this.row.selectOptions.find((x: any) => x.value.toString() === valObj.first?.toString());
            this.secondOptions = secondObj ? secondObj.children : [];
            const thirdObj = this.secondOptions.find((x: any) => x.value.toString() === valObj.second?.toString());
            this.thirdOptions = thirdObj ? thirdObj.children : [];
            this.selectModel = {...valObj};
        }
    }
}
