import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnService } from '../../services/xn.service';
import { SelectOptions } from '../../config/select-options';
import { debug } from 'util';

@Component({
    selector: 'xn-headquarters-select-input',
    templateUrl: './headquarters-select-input.component.html'
})
export class HeadquartersSelectInputComponent implements OnInit {
    @Input()
    row: any;
    @Input()
    form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    private options = [];
    selectItems = [];
    private enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    constructor(
        private er: ElementRef,
        private xn: XnService,
    ) {
    }

    ngOnInit() {
        // if (!!this.row.value) {
        //     this.selectValue = this.row.value;
        // }
        this.row.selectOptions = [];
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });

        this.initOptions();


    }

    onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }


    private initOptions() {
        // 若有交易模式控件，则与其联动
        const ctrl = this.form.get('isProxy');
        if (ctrl) {
            ctrl.valueChanges.subscribe(x => {
                this.getOptions(x);
            });
        } else if (this.row.options.isProxy) {
            this.getOptions(this.row.options.isProxy);
        } else {
            this.row.selectOptions = this.enterpriserSelectItems;
        }
    }

    private getOptions(isProxy) {
        this.options = [];
        this.row.selectOptions = [];
        this.xn.api
            .post('/llz/capital_list/get_head', { isProxy })
            .subscribe(res => {
                if (res.data && res.data.data) {
                    this.options = [].concat(res.data.data);
                    this.buildOptions(this.options);
                }
            });
    }

    private buildOptions(options: Array<any>) {
        this.row.selectOptions = options.map(item => {
            const label = `${item.orgName}`;
            const find = this.enterpriserSelectItems.find((x: any) => x.value === label);
            if (!!find) {
                return {
                    label: find.label,
                    value: find.value
                };
            }
            return {
                label,
                value: label
            };
        });
    }
}
