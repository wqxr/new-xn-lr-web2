import {Component, OnInit, Input, ElementRef, ViewContainerRef} from '@angular/core';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {XnUtils} from '../../common/xn-utils';
import {HonourEditModalComponent} from '../modal/honour-edit-modal.component';
import {HonourViewModalComponent} from '../modal/honour-view-modal.component';
import {HonourNewModalComponent} from '../modal/honour-new-modal.component';

declare let $: any;

@Component({
    selector: 'xn-honour-input',
    templateUrl: './honour-input.component.html',
    styles: [
            `
            .file-row-table {
                margin-bottom: 0
            }

            .file-row-table td {
                padding: 6px;
                border-color: #d2d6de;
                font-size: 12px;
            }

            .file-row-table th {
                font-weight: normal;
                border-color: #d2d6de;
                border-bottom-width: 1px;
                line-height: 100%;
                font-size: 12px;
            }

            .table-bordered {
                border-color: #d2d6de;
            }

            .table > thead > tr > th {
                padding-top: 7px;
                padding-bottom: 7px;
            }
        `
    ]
})
export class HonourInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    items: any[];
    mode: string;
    onlyEdit: string;

    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.mode = this.row.options.mode || 'upload';
        this.onlyEdit = this.row.options && this.row.options.onlyEdit;
        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onEdit(item: any) {
        if (this.row.flowId === 'financing_platform1') {
            item.flowId = 'financing_platform1';
        }

        XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourEditModalComponent, item).subscribe((v: any) => {
            if (v.action !== 'ok') {
                this.toValue();
                return;
            }

            // 把填写的内容补充到这里
            for (const sub of this.items) {
                if (sub.honourNum === v.honourNum) {
                    Object.keys(v).map(key => {
                        sub[key] = v[key];
                    });
                    this.toValue();
                    break;
                }
            }
        });
    }

    public onRemove(item: any) {
        if (item.fileId) {
            this.xn.api.post(`/attachment/delete`, {key: item.fileId}).subscribe(json => {
                // 从this.items里删除item
                for (let i = 0; i < this.items.length; ++i) {
                    if (this.items[i].honourNum === item.honourNum) {
                        this.items.splice(i, 1);
                        this.toValue();
                        return;
                    }
                }
            });
        } else {
            // 从this.items里删除item
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].honourNum === item.honourNum) {
                    this.items.splice(i, 1);
                    this.toValue();
                    return;
                }
            }
        }
    }

    public onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourViewModalComponent, item).subscribe(() => {
        });
    }

    public onNew() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourNewModalComponent, null).subscribe(v => {
            console.log(v);
            if (v === null) {
                return;
            }

            // 判断商票是否有重复
            for (let i = 0; i < this.items.length; ++i) {
                if (this.items[i].honourNum === v.honourNum) {
                    this.xn.msgBox.open(false, `商票号码(${v.honourNum})重复了，请您检查`);
                    return;
                }
            }

            this.items.push(v);
            this.toValue();
        });
    }

    public toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.items));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        // 当平台审核后，给保理初审时，电票详情补充带多一个参数onlyEdit，目的是对除保理到期日的按钮只读处理
        if (!!this.onlyEdit) {
            for (const item of this.items) {
                item.onlyEdit = this.onlyEdit;
            }
        }
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
