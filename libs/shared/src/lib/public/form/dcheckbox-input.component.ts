import {Component, OnInit, ElementRef, Input, OnChanges} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {setTimeout} from 'core-js/library/web/timers';

/**
 *  多选checkbox
 */
@Component({
    selector: 'xn-dcheckbox-input',
    templateUrl: './dcheckbox-input.component.html',
    styles: [
            `.row {
            padding-right: 15px;
            padding-left: 15px;
        }`,
            `.xn-input-font {
            font-weight: normal;
            margin-right: 10px
        }`
    ]
})
export class DcheckboxInputComponent implements OnInit, OnChanges {

    @Input() row: any;
    @Input() form: FormGroup;

    ctrl: AbstractControl;
    dcheck: AbstractControl;
    xnOptions: XnInputOptions;
    changeDisabled = false;

    constructor(private er: ElementRef) {
    }

    ngOnChanges() {
        this.ctrl = this.form.get(this.row.name);
        this.changeDisabled = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnInit() {
    }

    updateSelection(event, check, label) {
        this.ctrl.setValue(JSON.parse(this.ctrl.value));
        // 过滤 金地模式，万科模式不可同时选中
        // const filter = this.ctrl.value.filter(x => !!x.checked && x.checked === true); // 已经选中的项
        for (const row of this.ctrl.value) {
            if (label === row.label) {
                row.checked = !check;
            }
        }
        this.ctrl.setValue(JSON.stringify(this.ctrl.value));
    }

    // 公司性质选择  1 集团公司 3 项目公司
    subSelection(event, option, sub) {
        this.ctrl.setValue(JSON.parse(this.ctrl.value));
        this.ctrl.value.forEach(element => {
            if (element.value === option.value) {
                if (element.data && element.data.length) {
                    element.data.forEach(ele => {
                        if (ele.value === sub.value) {
                            ele.checked = !sub.checked;
                        }
                    });
                }
            }
        });
        this.ctrl.setValue(JSON.stringify(this.ctrl.value));
    }

    onClear() {
        if (JSON.parse(this.ctrl.value).length === 0) {
            return;
        }
        this.ctrl.setValue(JSON.parse(this.ctrl.value));
        for (const row of this.ctrl.value) {
            row.checked = false;
            if (row.data && row.data.length) {
                row.data.forEach(element => {
                    element.checked = false;
                });
            }
        }
        this.ctrl.setValue(JSON.stringify(this.ctrl.value));
    }
}
