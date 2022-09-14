import {Component, OnInit, ElementRef, ViewContainerRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {GroupEditModalComponent} from '../modal/group-edit-modal.component';
import {GroupViewModalComponent} from '../modal/group-view-modal.component';
import {GroupNewModalComponent} from '../modal/group-new-modal.component';

@Component({
    selector: 'xn-group-input',
    templateUrl: './group-input.component.html',
    styles: [
        `.file-row-table { margin-bottom: 0}`,
        `.file-row-table td { padding: 6px; border-color: #d2d6de; font-size: 12px; }`,
        `.file-row-table th { font-weight: normal; border-color: #d2d6de; border-bottom-width: 1px; line-height: 100%; font-size: 12px;}`,
        `.table-bordered {border-color: #d2d6de; }`,
        `.table > thead > tr > th { padding-top: 7px; padding-bottom: 7px; }`
    ]
})
export class GroupInputComponent implements OnInit {

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
        this.checkFile(this.items);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    checkFile(items) {
        for (const item of items) {
            if (!item.num || item && item.num === '') { // 这里没有金额表示该控件为空
                this.ctrl.setValue('');
                return false;
            }
            if (!item.files || item.files && item.files.length <= 0) { // 没有图片不能提交
                this.ctrl.setValue('');
                return false;
            }
        }
        return true;
    }

    private toValue() {
        // 如果没有图片，则不能提交

        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            const check = this.checkFile(this.items);
            if (!check) {
                return;
            }
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onEdit(item: any) {

        XnModalUtils.openInViewContainer(this.xn, this.vcr, GroupEditModalComponent, item).subscribe((v: any) => {

            // 把填写的内容补充到这里
            for (const k in v) {
                if (v.hasOwnProperty(k)) {
                    item[k] = v[k];  // item是this.items中的一个元素
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, GroupViewModalComponent, item).subscribe(() => {
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

}
