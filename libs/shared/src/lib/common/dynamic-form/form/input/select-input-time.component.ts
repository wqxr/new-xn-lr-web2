import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { log } from 'util';
import { SelectOptions } from '../../../../config/select-options';


@Component({
    templateUrl: './select-input-time.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({ type: 'select-time', formModule: 'default-input' })
export class SelectInputTimeComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    form1: FormGroup;
    public checker1 = [
        {
            title: '',
            checkerId: 'flowId',
            type: 'select',
            required: 0,
            options: { ref: 'vankeTradeStatus' },
        },
        {
            title: '',
            checkerId: 'time',
            type: 'quantum1',
            required: 0,
        }
    ];
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef,) {
    }

    ngOnInit() {
        this.checker1[0].options = this.row.options;
        XnFormUtils.buildSelectOptions(this.checker1);
        this.buildChecker(this.checker1);
        this.form1 = XnFormUtils.buildFormGroup(this.checker1);
        this.form1.valueChanges.subscribe(x => {
            this.ctrl.setValue(JSON.stringify(x));
        });
        this.ctrl = this.form.get(this.row.name);
        if (!!this.ctrl.value) {
            const currentValue = JSON.parse(JSON.stringify(this.ctrl.value));
            if (!!JSON.parse(currentValue).flowId) {
                this.form1.get('flowId').setValue(JSON.parse(currentValue).flowId);
            }
            if (!!JSON.parse(currentValue).time) {
                this.form1.get('time').setValue(JSON.parse(currentValue).time);
            }
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

}
