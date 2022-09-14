import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';

@Component({
    template: `
    <div [formGroup]="form">
    <select class="form-control xn-input-font"  [formControlName]="row.name" [ngClass]="myClass" (blur)="onBlur()">
      <option value="">请选择</option>
      <option *ngFor="let option of row.value1" value="{{option.appId}}">{{option.orgName}}</option>
    </select>
  </div>
  <span class="xn-input-alert">{{alert}}</span>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// 查看二维码checker项
@DynamicForm({ type: 'vankeAgency-select', formModule: 'dragon-input' })
export class VankeAgencySelectComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    list: any[] = [];

    constructor(private xn: XnService, private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
            // 改变状态
            this.publicCommunicateService.change.emit(v);
        });
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
