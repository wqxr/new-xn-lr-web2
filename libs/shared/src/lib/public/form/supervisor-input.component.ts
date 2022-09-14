import {Component, OnInit, ElementRef, ViewContainerRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {SupervisorEditModalComponent} from '../modal/supervisor-edit-modal.component';
import {SupervisorViewModalComponent} from '../modal/supervisor-view-modal.component';

@Component({
    selector: 'xn-supervisor-input',
    templateUrl: './supervisor-input.component.html',
    styles: [
            `.file-row-table {
            margin-bottom: 0
        }`,
            `.file-row-table td {
            padding: 6px;
            border-color: #d2d6de;
            font-size: 12px;
        }`,
            `.file-row-table th {
            font-weight: normal;
            border-color: #d2d6de;
            border-bottom-width: 1px;
            line-height: 100%;
            font-size: 12px;
        }`,
            `.table-bordered {
            border-color: #d2d6de;
        }`,
            `.table > thead > tr > th {
            padding-top: 7px;
            padding-bottom: 7px;
        }`
    ]
})
export class SupervisorInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    items: any[];
    mode: string;

    alert = '';
    ctrl: AbstractControl;
    numberChange: AbstractControl;
    supplierChange: AbstractControl;
    xnOptions: XnInputOptions;
    asset = false;
    map = false;
    mainFlowId = '';

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));

        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onEdit(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SupervisorEditModalComponent, item).subscribe((v: any) => {
            if (v.action !== 'ok') {
                this.toValue();
                return;
            }

            // 把填写的内容补充到这里
            for (const k in v) {
                if (v.hasOwnProperty(k)) {
                    item[k] = v[k];  // item是this.items中的一个元素
                }
            }
            this.toValue();
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SupervisorViewModalComponent, item).subscribe(() => {
        });
    }

    onRemove() {

    }

}
