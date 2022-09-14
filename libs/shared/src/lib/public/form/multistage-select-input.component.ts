import {Component, OnInit, Input, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

/**
 *  多级选择
 */
@Component({
    selector: 'app-xn-multistage-select-input',
    templateUrl: './multistage-select-input.component.html',
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
export class MultistageSelectInputComponent implements OnInit, OnChanges {

    @Input() row: any;
    @Input() form: FormGroup;
    ctrl: AbstractControl;
    selectOptions = [
        {label: '有', value: '1'},
        {label: '无', value: '0'}
    ];
    textBool: boolean;
    data = {has: '', momName: '', momAppId: ''} as any;
    alert = '';
    // 显示母公司
    shows: any[] = [
        {
            checkerId: 'hasMom',
            options: {ref: 'core'},
            title: '核心企业',
            type: 'picker',
            required: 1,
            validators: '',
            flowId: 'customize',
            memo: '母公司名称'
        }
    ];
    mainForm: FormGroup;

    constructor(private amountControlCommService: AmountControlCommService) {

    }

    ngOnChanges() {
        this.amountControlCommService.change.subscribe(x => {
            this.textBool = x.has;
            this.data.has = x.has === true ? '1' : '0';
            if (x.has === true) {
                this.shows[0].value = JSON.stringify({label: x.momName, value: x.momAppId});
                this.ngOnInit();
            }
            this.toValue();
        });
        this.amountControlCommService.change1.subscribe(x => {
            this.toValue(); // 选择母公司后触发
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
        if (this.data.has === '') {
            this.alert = '必填字段';
        } else {
            this.alert = '';
        }
    }

    // 选择
    handleSelect(e?) {
        if (!!e) {
            this.textBool = e.target.value === '1';
            this.data.has = e.target.value;
        }
        this.toValue();
    }

    // 如果 没有母公司或，有母公司
    private toValue() {
        const params = {
            has: this.data.has === '1' ? true : false,
            momName: this.jsonSw(this.mainForm.value.hasMom) ? JSON.parse(this.mainForm.value.hasMom).label : '',
            momAppId: this.jsonSw(this.mainForm.value.hasMom) ? JSON.parse(this.mainForm.value.hasMom).value : ''
        };
        // 无母公司，或存在母公司 可以提交,如果has===0,清空缓存值
        if (this.data.has === '0') {
            params.momName = '';
            params.momAppId = '';
        }
        if (this.data.has === '0' || (params.momName !== '' && params.momAppId !== '')) {
            this.ctrl.setValue(JSON.stringify(params));
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
