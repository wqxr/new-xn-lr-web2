import {Input, Component, OnInit, ElementRef, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {BillEditModalComponent} from '../modal/bill-edit-modal.component';
import {BillViewModalComponent} from '../modal/bill-view-modal.component';

@Component({
    selector: 'xn-bill-input',
    templateUrl: './bill-input.component.html',
    styles: [
        `.file-row-table { margin-bottom: 0}`,
        `.file-row-table td { padding: 6px; border-color: #d2d6de; font-size: 12px; }`,
        `.file-row-table th { font-weight: normal; border-color: #d2d6de; border-bottom-width: 1px; line-height: 100%; font-size: 12px;}`,
        `.table-bordered {border-color: #d2d6de; }`,
        `.table > thead > tr > th { padding-top: 7px; padding-bottom: 7px; }`
    ]
})
export class BillInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    items: any[];
    mode: string;
    item: any = {} as any;

    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

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
        this.item = XnUtils.parseObject(this.ctrl.value, []);

        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        if (JSON.stringify(this.item) === '{}') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.item));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onEdit(item: any) {
        const p = {} as any;
        for (const k in item) {
            p[k] = item[k];
        }
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BillEditModalComponent, p).subscribe((v: any) => {
            this.item = v;
            this.toValue();
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BillViewModalComponent, item).subscribe(() => {
        });
    }

}
