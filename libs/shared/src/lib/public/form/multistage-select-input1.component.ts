import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

/**
 *  多级选择
 */
@Component({
    selector: 'app-xn-multistage-select-input1',
    templateUrl: './multistage-select-input1.component.html',
    styles: [`
        .form-margin {
            margin-bottom: 15px;
        }

        .position {
            position: relative;
        }

        .position-tip {
            position: absolute;
            right: -105px;
            bottom: 5px;
            color: #9A9A9A;
        }
    `]
})
export class MultistageSelectInput1Component implements OnInit, OnChanges {

    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    // 选择固定比例的时候显示对应核心企业
    selectOptions = [
        {label: '固定比例', value: '固定比例'},
        {label: '固定金额', value: '固定金额'}
    ];
    textBool: boolean;
    // 额度设置方式，对应核心企业 id,额度比例，
    data = {type: '', enterpriseName: '', enterpriseAppId: '', rate: ''} as any;
    alert = '';
    // 显示母公司
    shows: any[] = [
        {
            checkerId: 'enterprise',
            options: {ref: 'core'},
            title: '对应核心企业',
            type: 'picker',
            required: 1,
            validators: '',
            flowId: 'customize1',
            memo: '对应核心企业'
        }, {
            checkerId: 'creditRate',
            title: '核心企业',
            type: 'text',
            required: 1,
            validators: '',
            flowId: 'customize1',
            memo: '授信额度比例'
        },
    ];
    mainForm: FormGroup;

    constructor(private amountControlCommService: AmountControlCommService) {

    }

    ngOnChanges() {
        this.amountControlCommService.rate.subscribe(x => {
            // 比例输入完比后设置值
            this.toValue();
        });
        this.amountControlCommService.change1.subscribe(x => {
            // 选定对应核心企业
            this.toValue();
        });
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    // 选择必须选项
    blur() {
        if (this.data.type === '') {
            this.alert = '必填字段';
        } else {
            this.alert = '';
        }
    }

    // 选择
    handleSelect(e?) {
        if (!!e) {
            this.textBool = e.target.value === '固定比例';
            this.data.type = e.target.value;
        }
        this.toValue();
    }

    // 如果 没有母公司或，有母公司
    private toValue() {
        const params = {
            type: this.data.type,
            enterpriseName: this.jsonSw(this.mainForm.value.enterprise) ? JSON.parse(this.mainForm.value.enterprise).label : '',
            enterpriseAppId: this.jsonSw(this.mainForm.value.enterprise) ? JSON.parse(this.mainForm.value.enterprise).value : '',
            rate: this.mainForm.value.creditRate || '',
        };
        if (params.type === '固定金额') { // 如果切换到其他选项，清空已有选项
            params.enterpriseName = '';
            params.enterpriseAppId = '';
            params.rate = '';
        }
        if (params.type === '固定金额' || (params.enterpriseName !== '' && params.enterpriseAppId !== '' && params.rate !== '')) {
            this.ctrl.setValue(params);
        } else {
            this.ctrl.setValue('');
        }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private jsonSw(value: any) {
        return !!value && value !== '';
    }
}
