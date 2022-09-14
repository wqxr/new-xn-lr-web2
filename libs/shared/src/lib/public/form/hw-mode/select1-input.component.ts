import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {PublicCommunicateService} from 'libs/shared/src/lib/services/public-communicate.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';

/**
 *  定向支付 - 供应商变更协议详情
 */
@Component({
    selector: 'xn-select1-input',
    templateUrl: './select1-input.component.html'
})
export class Select1InputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    public myClass = '';
    public alert = '';
    public value = '';
    private ctrl: AbstractControl;
    private xnOptions: XnInputOptions;

    public constructor(private er: ElementRef, private publicCommunicateService: PublicCommunicateService, private localStorageService: LocalStorageService) {
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public handleChange(e) {
        this.value = e.target.value;
        this.localStorageService.setChangeType(this.value);
        this.publicCommunicateService.change.emit(this.value);
        this.ctrl.setValue(this.value);
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    public onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
