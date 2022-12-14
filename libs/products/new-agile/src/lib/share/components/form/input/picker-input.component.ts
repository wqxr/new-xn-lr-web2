import {Component, OnInit, ElementRef, Input, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { EnterpriseTypeEnum } from 'libs/shared/src/lib/config/enum';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';


@Component({
    selector: 'xn-picker-input',
    templateUrl: './picker-input.component.html',
    styles: [
            `.picker-row {
            background-color: #ffffff
        }

        .form-control button:focus {
            outline: none
        }

        .xn-picker-label {
            display: inline-block;
            max-width: 95%
        }

        .span-disabled {
            background-color: #eee
        }

        .input-class {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 6px 10px;
            border: 0;
        }

        .inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'picker', formModule: 'new-agile-input' })
export class PickerInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;

    label;
    myClass = '';
    labelClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    ctrlChange: AbstractControl;
    lv: AbstractControl;
    xnOptions: XnInputOptions;
    pickerObj: any;
    ctrlKind = '';
    isCard = false;
    isArray = false;
    inMemo = '';
    changeGetNewDataApi = '';

    constructor(private xn: XnService, private er: ElementRef, private amountControlCommService: AmountControlCommService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrlChange = this.row.options && this.row.options.change && this.form.get(this.row.options.change);
        this.inMemo = this.row.options !== '' && this.row.options.inMemo || '';

        this.isCard = !!(this.row.options && this.row.options.kind === 'card'); // ?????????kind??????????????????????????????card???????????????card???????????????
        this.isArray = !!(this.row.options && this.row.options.kind === 'isArray'); // ?????????kind??????????????????????????????card???????????????card???????????????

        const arr = this.row.options.change;


        this.changeGetNewDataApi = this.row.options && this.row.options.api || '';
        // console.log("arrObj: ", JSON.parse(arr));

        // console.log("change: ", JSON.parse(JSON.stringify(this.row.options.change)));

        // this.isCard = false;

        if (!this.isCard) {
            this.ctrl.valueChanges.subscribe(() => {
                this.fromValue();
            });
        }

        this.ctrl.statusChanges.subscribe(status => {
        });

        // ???????????????, string ?????????0??????
        if (!!this.row.value) {
            if (typeof (this.row.value) === 'string' && !XnUtils.isZero(this.row.value)) {  // ????????????????????????????????????????????????string????????????json
                if (typeof (JSON.parse(this.row.value)) === 'object') {
                    this.row.value = this.row.value && JSON.parse(this.row.value);
                } else {
                    this.row.value = this.row.value;
                }
            }
            this.toValue(this.row.value);
        } else if (!!this.ctrl.value) {
            this.fromValue();
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onPicker() {
        if (!this.ctrlChange) {
            new DataTablePicker(this.xn).open('?????????', this.row.options.ref, obj => this.toValue(obj),
                () => {
                },
                {type: EnterpriseTypeEnum[this.row.options.ref]});
        } else {
            new DataTablePicker(this.xn).open('?????????', this.row.options.ref, obj => this.toPickerObj(obj),
                () => {
                },
                {type: EnterpriseTypeEnum[this.row.options.ref]});
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    // ????????????toValue??????????????????object???????????????????????????????????????
    private toPickerObj(obj): void {
        this.pickerObj = obj;
        this.ctrl.setValue(obj.label);
        // ?????????isCard???????????????
        if (this.isCard) {
            this.input.nativeElement.value = obj.label;
            this.cardFormat();
        }
        this.ctrlChange.setValue(obj.value);

        if (this.isArray) {
            this.getData(obj);
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
        this.showClearBtn = true;
    }

    private fromValue() {
        if (!this.ctrlChange) {
            this.calcAlertClass();
            this.formatLabel(this.ctrl.value);
        } else {
            if (this.isCard) {
                this.input.nativeElement.value = this.ctrl.value;
                this.cardFormat(); // ???????????????????????????money?????????
            } else {
                this.formatLabel(this.ctrl.value);
            }
        }
    }

    private toValue(obj) {
        if (!obj) {
            this.ctrl.setValue('');
            this.ctrlChange && this.isCard ? this.input.nativeElement.value = '' : '';
        } else {
            if (this.ctrlChange && this.isCard) {
                obj.constructor === String ? obj : obj = obj.toString();
                this.ctrl.setValue(obj.replace(/\s/g, '').replace(/\D/g, ''));
                // ?????????setTimeout???????????????input??????
                setTimeout(() => {
                    this.input.nativeElement.value = this.ctrl.value;
                    this.cardFormat();
                    this.showClearBtn = this.ctrl.invalid ? false : true;
                }, 0);
            } else {
                this.ctrl.setValue(JSON.stringify(obj));
            }

            if (this.isArray) {
                this.getData(obj);
            }
        }

        // ??????-?????????????????????????????????
        if (this.row.flowId === 'financing_enterprise_m' && this.row.checkerId === 'enterprise' && this.ctrl.value !== '') {
            this.xn.api.post('/yb/risk1/quota/quota_enterprise', {enterpriseName: JSON.parse(this.ctrl.value).label}).subscribe(x => {
                this.amountControlCommService.change.emit(x.data); // ????????????????????????

            });
        }

        // ???????????????????????????
        if (this.row.flowId === 'customize' && this.ctrl.value !== '') {
            this.xn.api.post('/yb/risk1/quota/get_left_amount', {momName: JSON.parse(this.ctrl.value).label}).subscribe(x => {
                this.amountControlCommService.change1.emit(x.data); // ????????????????????????

            });
        }

        // ??????-??????????????????????????????????????????????????????
        if (this.row.flowId === 'customize1' && this.ctrl.value !== '') {
            this.xn.api.post('/yb/risk1/quota/get_core_amount', {enterpriseName: JSON.parse(this.ctrl.value).label}).subscribe(x => {
                this.amountControlCommService.change1.emit(x.data); // ????????????????????????

            });
        }
        // ???????????????????????????????????????????????????
        if (this.row.flowId === 'financing_supplier_enterprise' && this.ctrl.value !== '' && this.row.checkerId === 'supplier') {
            this.xn.api.post('/yb/risk1/quota/get_deal', {supplierName: JSON.parse(this.ctrl.value).label}).subscribe(x => {
                this.amountControlCommService.change.emit(x.data); // ????????????????????????

            });
        }
        this.showClearBtn = this.ctrl.invalid ? false : true;
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    private getData(obj) {
        const url = this.changeGetNewDataApi === '' ? '/amount' : this.changeGetNewDataApi;
        this.xn.api.post(`${url}/?method=get`, {
            enterpriseAppId: obj.value
        }).subscribe(json => {
            // this.lv = this.row.options && this.row.options.change && this.form.get(this.row.options.change[0]);
            // this.lv.setValue(json.data.factoringSYF);
            if (this.row.options && this.row.options.tochange) {
                for (const row of this.row.options.tochange) {
                    this.lv = this.form.get(row);

                    if (!json.data[row]) {
                        this.lv.setValue('');
                    }
                    this.lv.setValue(json.data[row]);
                }
            }
        });
    }

    private formatLabel(obj) {
        if (!obj) {
            this.label = '?????????';
            this.showClearBtn = false;
        } else {
            if (obj && (typeof obj === 'string') && !this.ctrlChange) {
                obj = JSON.parse(obj);
            }
            if (!!obj.label && !this.ctrlChange) {
                this.label = `${obj.label || ''}`;
            }
            // ?????????????????????????????????
            if (!!this.ctrlChange) {
                this.label = obj;
            }

            // this.showClearBtn = this.ctrl.disabled ? false : true;
            this.showClearBtn = this.ctrl.invalid ? false : true;
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.labelClass = this.ctrl.disabled ? 'span-disabled' : '';
        // this.labelClass = this.ctrl.invalid ? 'span-disabled' : '';
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onClear() {
        this.toValue(null);
        if (this.ctrlChange) {
            this.ctrlChange.setValue('');
        }
        if (this.row.options && this.row.options.tochange) {
            for (const row of this.row.options.tochange) {
                this.lv = this.form.get(row);
                this.lv.setValue('');
            }
        }
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    // ?????????????????????????????????card
    onInput() {
        this.cardFormat(); // ????????????????????????money?????????
        this.toValue(this.input.nativeElement.value);
        this.calcAlertClass();
        this.showClearBtn = !this.ctrl.invalid;
    }

    // ?????????????????????4?????????????????????
    // ?????????????????????????????????????????????
    cardFormat() {
        // console.log("prev: " + this.input.nativeElement.value);

        let num = this.input.nativeElement.value;

        num = num.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ');

        this.input.nativeElement.value = num;

        // console.log("after: " + this.input.nativeElement.value);

    }
}
