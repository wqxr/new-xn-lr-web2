import {ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';




@Component({
    selector: 'qrs-select-file',
    template:  `
    <div [formGroup]="form">
        <select class="form-control xn-input-font"  [formControlName]="row.name" [ngClass]="myClass" (blur)="onBlur()">
            <option value="">请选择</option>
            <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
        </select>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'qrs-select-file', formModule: 'dragon-input' })
export class QrsSelectFileInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    ctrl_headquarters: AbstractControl;
    ctrl_type: AbstractControl;
    xnOptions: XnInputOptions;
    fileTypeMatch = {
        深圳市龙光控股有限公司: [
            { label: '《付款确认书(总部致保理商)》', value: '1' },
            { label: '《付款确认书(总部致劵商)》', value: '2' },
        ],
        万科企业股份有限公司: [
            { label: '《付款确认书》', value: '3' },
        ],
        雅居乐集团控股有限公司: [
            { label: '《付款确认书（总部致供应商）》', value: '4'},
            { label: '《付款确认书（项目公司致供应商）》', value: '5' }
        ],
        龙光工程建设有限公司: [
            { label: '《付款确认书(总部致保理商)》', value: '1' },
            { label: '《付款确认书(总部致劵商)》', value: '2' },
        ],
        碧桂园地产集团有限公司: [
            { label: '《付款确认书》', value: '3' },
        ],
        深圳华侨城股份有限公司: [
            { label: '《付款确认书》', value: '3' },
        ],
    };
    constructor(private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                private cdr: ChangeDetectorRef,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl_headquarters = this.form.get('headquarters');
        this.ctrl_type = this.form.get('type');
        this.calcAlertClass();
        this.ctrl_type.valueChanges.subscribe(t => {
            if (!t){
                this.ctrl_headquarters.setValue('');
            }
            this.ctrl.setValue('');
            // this.cdr.markForCheck();
        });
        console.log('headquarters',this.ctrl_headquarters.value);

        this.ctrl_headquarters.valueChanges.subscribe(h => {
            if (h){
                this.row.selectOptions = this.fileTypeMatch[h];
            }
            this.ctrl.setValue('');
            this.cdr.markForCheck();
        });
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
            // 改变状态
            this.publicCommunicateService.change.emit(v);
        });
        if (!!this.row.value){
            this.ctrl.setValue(String(this.row.value));
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        // this.localStorageService.setCacheValue('headquarters', v);
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
