import { Component, OnInit, ElementRef, Input, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { XnService } from '../../services/xn.service';

@Component({
    selector: 'app-vk-select1-input',
    templateUrl: './vk-select1-input.component.html'
})
export class VkSelect1InputComponent implements OnInit, AfterViewChecked {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    ctrlEnterprise: AbstractControl;
    to: AbstractControl;
    xnOptions: XnInputOptions;
    enterprise: string;
    data = [];
    tochange = [];
    temp = '';

    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.temp = this.ctrl.value;
        const refs = this.row.options.ref;
        this.ctrlEnterprise = this.form.get(refs[0]);
        this.tochange = this.row.options.tochange;
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            const lv = this.formatlv(v);
            if (lv.length === 0) {
                return;
            }
            this.tochange.forEach(change => {
                this.to = this.form.get(change);
                this.to.setValue(lv[change]);
            });
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngAfterViewChecked() {
        if (this.enterprise === this.ctrlEnterprise.value) {
            return;
        }
        setTimeout(() => {
            if (this.temp === '') {
                this.ctrl.setValue('');
            }
        }, 0);
        this.enterprise = this.ctrlEnterprise.value;
        this.getEnterprise(this.enterprise);
    }

    private getEnterprise(enterprise) {
        this.xn.api.post('/quota/list_wk1', {
            enterprise
        }).subscribe(v => {
            this.temp = '';
            this.data = v.data;
            this.row.selectOptions = this.formatData(v.data);
        });
    }

    private formatlv(enterprise) {
        return this.data.find(a => a.enterpriseName1 === enterprise) || [];
    }

    private formatData(datas) {
        return datas.map(data => {
            return {
                label: data.enterpriseName1,
                value: data.enterpriseName1
            };
        });
    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
