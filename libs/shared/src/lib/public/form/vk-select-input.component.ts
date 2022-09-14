import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import { XnService } from '../../services/xn.service';

@Component({
    selector: 'app-vk-select-input',
    templateUrl: './vk-select-input.component.html'
})
export class VkSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    to: AbstractControl;
    tochange = [];
    data = [];

    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.tochange = this.row.options.tochange;
        this.calcAlertClass();

        this.getEnterprise();

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

    private getEnterprise() {
        this.xn.api.post('/quota/list_wk', {}).subscribe(v => {
            this.data = v.data;
            this.row.selectOptions = this.formatData(v.data);
        });
    }

    private formatData(datas) {
        return datas.map(data => {
            return {
                label: data.enterpriseName,
                value: data.enterpriseName
            };
        });
    }

    private formatlv(enterprise) {
        return this.data.find(a => a.enterpriseName === enterprise) || [];
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
