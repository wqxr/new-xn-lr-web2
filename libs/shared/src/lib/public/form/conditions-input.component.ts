import {Component, OnInit, ElementRef, Input, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {setTimeout} from 'core-js/library/web/timers';
import {XnService} from '../../services/xn.service';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {ApprovalReadModalComponent} from '../modal/approval-read-modal.component';

@Component({
    selector: 'xn-conditions-input',
    templateUrl: './conditions-input.component.html',
    styles: [
        `.row { padding-right: 15px; padding-left: 15px; }`,
        `.xn-input-font { font-weight: normal; margin-right: 10px; margin-bottom: 5px }`,
        `.check-value { text-overflow:ellipsis; white-space: nowrap; overflow: hidden; max-width: 300px;
            margin-right: 10px; display: inline-block; vertical-align: top; }`,
        `input[type=checkbox] { margin: 3px 0px 0px; }`,
        `.v-top { vertical-align: top }`,
        `table { margin-bottom: 0;}`
    ]
})
export class ConditionsInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    required = false;

    ctrl: AbstractControl;
    dcheck: AbstractControl;
    xnOptions: XnInputOptions;
    enterprise: any = {} as any;
    conditions: any[] = [];

    constructor(private er: ElementRef, private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }

    private fromValue() {
        this.enterprise = XnUtils.parseObject(this.ctrl.value, []);
        this.getConditions(this.enterprise);
    }

    private getConditions(enterprise) {
        if (!(enterprise && enterprise.label && enterprise.value)) {
            return;
        }
        if (enterprise.conditions && enterprise.conditions.length > 0) {
            this.conditions = this.addValue($.extend(true, [], enterprise.conditions));
            return;
        }
        this.xn.api.post('/tool/condition_list', {
            appId: enterprise.value
        }).subscribe(json => {
            // this.items = json.data;
            const conditions = json.data;
            this.conditions = this.addValue(conditions) || [];
        });
    }

    addValue(conditions) {
        if (!conditions || conditions.length <= 0) {
            return;
        }
        const newCondition = $.extend(true, [], conditions); // 深拷贝
        for (const condition of newCondition) {
            condition.value = condition.content;
            condition.label = condition.content;
        }
        return newCondition;
    }

    private toValue() {
        const conditions = $.extend(true, [], this.conditions); // 深拷贝

        conditions.map(v => { // 删除value,删除label，以免传给后端的内容重复过多
            delete v.value;
            delete v.label;
            return v;
        });

        if (this.conditions.length === 0) {
            this.enterprise.conditions = [];
        } else {
            this.enterprise.conditions = conditions;
        }
        this.ctrl.setValue(JSON.stringify(this.enterprise));
    }

    updateSelection(event, label, i) {
        const checked = event.target.checked;
        if (checked) {
            this.conditions[i].checked = true;
        } else {
            this.conditions[i].checked = false;
        }

        this.toValue();
    }

    onClear() {
        if (JSON.parse(this.ctrl.value).length === 0) {
            return;
        }
        this.ctrl.setValue(JSON.parse(this.ctrl.value));
        for (const row of this.ctrl.value) {
            row.checked = false;
        }
        this.ctrl.setValue(JSON.stringify(this.ctrl.value));
    }

    onViewRead(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalReadModalComponent, item).subscribe(v => {
        });
    }
}
