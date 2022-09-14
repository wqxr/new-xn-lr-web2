import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {XnService} from '../../services/xn.service';

@Component({
    selector: 'xn-tselect-input',
    templateUrl: './tselect-input.component.html',
    styles: [
        `.xn-dselect-first { padding-right: 2px; }`,
        `.xn-dselect-second { padding-left: 2px; }`,
        `.mb15 { margin-bottom: 15px }`
    ]
})
export class TselectInputComponent implements OnInit {

    @Input() row: any;
    @Input() factory?: any;
    @Input() form: FormGroup;

    required = false;
    firstClass = '';
    secondClass = '';
    thirdClass = '';
    alert = '';

    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    // secondOptions: any[] = [];
    // thirdOptions: any[] = [];

    firstValue = '';
    secondValue = '';
    thirdValue = '';
    firstOptions: any[] = [];
    secondOptions: any[] = [];
    thirdOptions: any[] = [];

    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.required = (this.row.required === true || this.row.required === 1);

        this.getFirstValue();
        // this.getSecondValue();
        // this.getThreeValue();

        // 设置初始值
        if (this.ctrl.value) {
            const value = XnUtils.parseObject(this.ctrl.value);
            this.firstValue = value.first || '';
            this.secondOptions = this.row.selectOptions.second[this.firstValue];
            this.secondValue = value.second || '';
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    getFirstValue() {
        this.xn.api.post('/tool/wk', {
            factoringAppId: this.factory
        }).subscribe(json => {
            const firstValue = this.buildOptions(json.data.map(v => {
                return {
                    name: v.enterpriseName
                };
            }));
            this.firstOptions = firstValue;
        });
    }

    getSecondValue(name) {
        this.xn.api.post('/tool/wk1', {
            factoringAppId: this.factory,
            enterpriseName: name
        }).subscribe(json => {
            if (json.data.length <= 0) {
                this.clear2();
            }
            this.clear3();
            const secondValue = this.buildOptions(json.data.map(v => {
                return {
                    name: v.enterpriseName1
                };
            }));
            this.secondOptions = secondValue;
        });
    }

    clear2() {
        this.secondValue = '';
        this.thirdValue = '';

        this.secondOptions = [];
        this.thirdOptions = [];
    }

    clear3() {
        this.thirdValue = '';
        this.thirdOptions = [];
    }

    getThreeValue(name1, name2) {
        this.xn.api.post('/tool/wk2', {
            factoringAppId: this.factory,
            enterpriseName: name1,
            enterpriseName1: name2
        }).subscribe(json => {
            if (json.data.length <= 0) {
                this.clear3();
            }

            const thirdValue = this.buildOptions(json.data.map(v => {
                return {
                    name: v.enterpriseName2
                };
            }));
            this.thirdOptions = thirdValue;
        });
    }

    buildOptions(data) {
        const array = $.extend(true, [], data);
        return array.map(v => {
            return {
                label: v.name,
                value: v.name
            };
        });
    }

    onFirstBlur(event) {
        if (!this.required) { return; }

        // console.log('firstValue: ', this.firstGetOptions);
        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.firstClass = 'xn-control-invalid';
            // this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        }
    }

    onSecondBlur(event) {
        if (!this.required) { return; }
        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.secondClass = 'xn-control-invalid';
            // this.alert = this.row.selectOptions.secondPlaceHolder;
        }
    }

    onThirdBlur(event) {
        if (!this.required) { return; }
        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.thirdClass = 'xn-control-invalid';
            // this.alert = this.row.selectOptions.secondPlaceHolder;
        }
    }

    onFirstChange(event) {

        // console.log('firstValue: ', this.firstGetOptions);
        // const firstOption: any = event.target.selectedOptions[0];
        // this.firstValue = firstOption.value;  // 没有使用ngModel双向绑定，所以要自己处理
        this.firstValue = event.target.value;

        if (this.firstValue === '') {
            // 删掉值
            this.clear2();

            this.ctrl.setValue('');
            if (this.required) {
                this.firstClass = 'xn-control-invalid';
                // this.alert = this.row.selectOptions.firstPlaceHolder;
            }
        } else {
            if (this.required) {
                this.firstClass = 'xn-control-valid';
                this.secondClass = '';
                this.alert = '';
            }

            this.getSecondValue(this.firstValue);

            // this.secondOptions = this.secondGetOptions;
            if (this.secondOptions.length > 0) {
                this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(JSON.stringify({
                    first: this.firstValue
                }));
            }
        }
    }

    onSecondChange(event) {
        // const option: any = event.target.selectedOptions[0];
        // const value = option.value;
        const value = event.target.value;
        this.secondValue = value;

        if (value === '') {
            this.clear3();

            if (this.required) {
                this.secondClass = 'xn-control-invalid';
                // this.alert = this.row.selectOptions.secondPlaceHolder;
            }

            this.ctrl.setValue('');
        } else {

            this.getThreeValue(this.firstValue, this.secondValue);

            // this.thirdOptions = this.thirdGetOptions;
            if (this.required) {
                this.secondClass = 'xn-control-valid';
                this.alert = '';
            }

            this.ctrl.setValue(JSON.stringify({
                first: this.firstValue,
                second: value
            }));
        }
    }

    onThirdChange(event) {
        // const option: any = event.target.selectedOptions[0];
        // const value = option.value;
        const value = event.target.value;
        this.thirdValue = value;

        if (value === '') {

            if (this.required) {
                this.thirdClass = 'xn-control-invalid';
                // this.alert = this.row.selectOptions.secondPlaceHolder;
            }

            this.ctrl.setValue('');
        } else {
            if (this.required) {
                this.thirdClass = 'xn-control-valid';
                this.alert = '';
            }

            this.ctrl.setValue(JSON.stringify({
                first: this.firstValue,
                second: this.secondValue,
                third: value
            }));
        }
    }
}
