import {Component, Input, OnInit, ElementRef, ViewContainerRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnService} from '../../services/xn.service';
import {XnUtils} from '../../common/xn-utils';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {ContractEditModalComponent} from '../modal/contract-edit-modal.component';
import {ContractViewModalComponent} from '../modal/contract-view-modal.component';
import {ContractNewModalComponent} from '../modal/contract-new-modal.component';
import {ContractEdit1ModalComponent} from '../modal/contract-edit1-modal.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ContractView1ModalComponent} from '../modal/contract-view1-modal.component';

@Component({
    selector: 'xn-contract-input',
    templateUrl: './contract-input.component.html',
    styles: [
            `.file-row-table {
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
        }`
    ]
})
export class ContractInputComponent implements OnInit {

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
    flowId = '';

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.mode = this.row.options.mode || 'upload';
        this.ctrl = this.form.get(this.row.name);
        this.asset = this.row.options.asset || false;
        this.map = this.row.options.map || false;
        this.mainFlowId = this.row.options.mainFlowId || this.localStorageService.caCheValue.mainFlowId || '';
        this.flowId = this.row.flowId;

        this.numberChange = this.form.get('numberMoney');
        this.supplierChange = this.form.get('supplier');
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {

            const moneyArr: any = [];
            let supplierInfo = '';
            for (const item of this.items) {
                if (item.items) {
                    for (const row of item.items) {
                        moneyArr.push(row);
                    }
                }
                if (item.supplier) {
                    supplierInfo = item.supplier;
                }
            }
            this.ctrl.setValue(JSON.stringify(this.items));
            if (this.numberChange) {
                this.numberChange.setValue(JSON.stringify(moneyArr));
            }


            if (this.supplierChange && this.supplierChange.value === '') {
                this.supplierChange.setValue(supplierInfo);
            }
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  补录合同
     * @param item
     */
    public onEdit(item: any) {
        const p = {} as any;
        Object.keys(item).map(k => {
            p[k] = item[k];

        });
        p.supplierInit = this.supplierChange && this.supplierChange.value;
        p.asset = this.asset;
        p.map = this.map;
        p.mainFlowId = this.mainFlowId;
        p.allFiles = this.row.value;
        // 如果两票一合同（基础模式financing_platform、委托模式financing_platform2、回购模式financing_platform1）
        // 平台审核，补录合同（flowId），则 ContractEdit1ModalComponent
        if (this.flowId === 'financing_platform' || this.flowId === 'financing_platform1' || this.flowId === 'financing_platform2') {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractEdit1ModalComponent, p).subscribe((v: any) => {
                if (v.action !== 'ok') {
                    this.toValue();
                    return;
                }

                if (this.map !== true) {
                    for (const item2 of this.items) {
                        if (item2 !== item && item2.contractNum === v.contractNum) {
                            this.xn.msgBox.open(false, `合同编号(${v.contractNum})重复了，请您检查`);
                            return;
                        }
                    }
                }

                // 把填写的内容补充到这里
                Object.keys(v).map(k => {
                    item[k] = v[k];  // item是this.items中的一个元素
                });
                this.toValue();
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractEditModalComponent, p).subscribe((v: any) => {
                if (v.action !== 'ok') {
                    this.toValue();
                    return;
                }

                if (this.map !== true) {
                    for (const item2 of this.items) {
                        if (item2 !== item && item2.contractNum === v.contractNum) {
                            this.xn.msgBox.open(false, `合同编号(${v.contractNum})重复了，请您检查`);
                            return;
                        }
                    }
                }

                // 把填写的内容补充到这里
                Object.keys(v).map(k => {
                    item[k] = v[k];  // item是this.items中的一个元素
                });
                this.toValue();
            });
        }

    }

    onRemove(item: any) {
        this.xn.api.post(`/attachment/deletes`, {
            keys: item.files.map(v => v.fileId)
        }).subscribe(json => {
            this.items.splice(this.items.indexOf(item), 1);
            this.toValue();
        });
    }

    onView(item: any) {
        item.map = this.map;
        item.supplier = this.supplierChange && this.supplierChange.value || item.supplier;
        if (this.flowId === 'financing_platform' || this.flowId === 'financing_platform1' || this.flowId === 'financing_platform2') {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractView1ModalComponent, item).subscribe(() => {
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractViewModalComponent, item).subscribe(() => {
            });
        }

    }

    onNew() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractNewModalComponent, null).subscribe(v => {
            console.log(v);
            if (v === null) {
                return;
            }

            this.items.push(v);
            this.toValue();
        });
    }

}
