import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ContractInformationInputComponent } from './contract-information-input.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';

@Component({
    template: `
    <div class="file">
        <select class="form-control xn-input-font" [value]='selectValue' (change)='getFileType($event)' [ngClass]="myClass" (blur)="onBlur()">
            <option value="">请选择</option>
            <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
        </select>
    </div>
    <div class="upload" style="margin-top: 15px;">
        <ng-container *ngIf="selectValue==='1' || selectValue==='2' || selectValue==='3' || selectValue==='4'">
            <dragon-selectfile-input [row]='row' [form]='form' [select]="selectValue" [allFiles]="allFiles"></dragon-selectfile-input>
        </ng-container>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../show-dragon-input.component.css']
})
// 查看二维码check 上传付款确认书 上传文件特殊check项
@DynamicForm({ type: 'replace-select', formModule: 'dragon-input' })
export class DragonpaymentSelectComponet implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    myClass = '';
    alert = '';
    selectValue = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    allFiles = {
        factoringPayConfirmYyj: [],    // 付款确认书（总部致保理商）影印件
        brokerPayConfirmYyj: [],   // 付款确认书（总部致券商）影印件
        pdfProjectFiles: [],   // 付款确认书影印件
    };
    fileTypeMatch = {
        深圳市龙光控股有限公司: [
            { label: '《付款确认书(总部致保理商)》', value: 1 },
            { label: '《付款确认书(总部致劵商)》', value: 2 },
        ],
        万科企业股份有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
        雅居乐集团控股有限公司: [
            { label: '《付款确认书（适用于雅居乐控股向供应商出具）》', value: 3 },
        ],
        碧桂园地产集团有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
        深圳华侨城股份有限公司: [
            { label: '《付款确认书》', value: 3 },
        ],
    };
    constructor(private er: ElementRef, private xn: XnService,) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);
        this.row.options = { fileext: 'jpg, jpeg, png,pdf' };
        this.row.selectOptions = this.fileTypeMatch[this.svrConfig.headquarters];
        this.svrConfig.selectValue = this.selectValue;
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    getFileType(e) {
        this.selectValue = e.target.value.toString();
        this.svrConfig.selectValue = e.target.value.toString();
    }
    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
enum selectType {
    factoringPayConfirmYyj = 1,    // 付款确认书（总部致保理商）影印件
    brokerPayConfirmYyj = 2,   // 付款确认书（总部致券商）影印件
    pdfProjectFiles = 3,     // 付款确认书影印件
}
