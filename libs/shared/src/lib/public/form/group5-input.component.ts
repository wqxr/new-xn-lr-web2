import {Component, OnInit, ElementRef, ViewContainerRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {Group5EditModalComponent} from '../modal/group5-edit-modal.component';
import {Group5ViewModalComponent} from '../modal/group5-view-modal.component';
import {GroupNewModalComponent} from '../modal/group-new-modal.component';
import {PdfSignModalComponent} from '../../public/modal/pdf-sign-modal.component';

@Component({
    selector: 'xn-group5-input',
    templateUrl: './group5-input.component.html',
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
export class Group5InputComponent implements OnInit {

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
        this.items.forEach(item => {
            item.payFiles = JSON.parse(item.payFiles);
        });
        this.checkFile(this.items);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    checkFile(items) {
        for (const item of items) {
            if (!item.num || item && item.num === '') { // ???????????????????????????????????????
                this.ctrl.setValue('');
                return false;
            }
        }

        const itemArr = this.copyArrAndFilter(this.items);
        this.ctrl.setValue(JSON.stringify(itemArr));
        return true;
    }

    copyArrAndFilter(items) {
        const itemArr = $.extend(true, [], this.items);
        itemArr.forEach(element => {
            element.payFiles = JSON.stringify(element.payFiles);
        });
        return itemArr;
    }

    private toValue() {
        // ????????????????????????????????????

        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            const check = this.checkFile(this.items);
            if (!check) {
                return;
            }
            const itemArr = this.copyArrAndFilter(this.items);
            this.ctrl.setValue(JSON.stringify(itemArr));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onEdit(item: any) {

        XnModalUtils.openInViewContainer(this.xn, this.vcr, Group5EditModalComponent, item).subscribe((v: any) => {

            // ?????????????????????????????????
            for (const k in v) {
                if (v.hasOwnProperty(k)) {
                    item[k] = v[k];  // item???this.items??????????????????
                }
            }
            this.toValue();
        });
    }

    onRemove(item: any) {
        this.items.splice(this.items.indexOf(item), 1);
        this.toValue();
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, Group5ViewModalComponent, item).subscribe(() => {
        });
    }

    onNew() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, GroupNewModalComponent, null).subscribe(v => {
            console.log(v);
            if (v === null) {
                return;
            }

            this.items.push(v);
            this.toValue();
        });
    }

    showContract(id: string, secret: string, label: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id,
            secret,
            label,
            readonly: true
        }).subscribe(() => {
        });
    }

}
