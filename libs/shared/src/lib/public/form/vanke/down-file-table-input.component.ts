import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnInputOptions} from '../xn-input.options';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {EditInfoModalComponent} from '../../component/edit-info-modal.component';
import TableHeadConfig from 'libs/shared/src/lib/config/table-head-config';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';

/**
 *  财务表格下载
 */
@Component({
    selector: 'app-xn-down-file-table-input',
    templateUrl: './down-file-table-input.component.html',
    styles: [`

        .table-display tr td {
            width: 200px;
            vertical-align: middle;
        }

        .height {
            width: 100%;
            overflow-x: hidden;
        }

        .table {
            table-layout: fixed;
            width: 1300px;
        }

        .table-height {
            max-height: 600px;
            overflow: auto;
        }

        .head-height {
            position: relative;
            overflow: auto;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .fix-table {
            margin-top: 15px;
        }

        .fix-table label {
            padding-top: 7px;
        }
    `]
})
export class DownFileTableInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    // 数组字段
    heads: any[] = [];
    // 应收账款保理计划表数据
    items: any[] = [];

    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    headLeft = 0;
    allCheckedStatus: boolean;
    selectItems: any[] = [];
    data: any[] = [];
    procedureId: boolean;
    enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef,
                private bankManagementService: BankManagementService) {
    }

    ngOnInit() {
        this.procedureId = this.row.procedureId === '@begin';
        this.ctrl = this.form.get(this.row.name);

        this.heads = this.row.checkerId === 'downInfo_accounting'
            ? TableHeadConfig.getConfig('会计下载').headText : TableHeadConfig.getConfig('出纳下载').headText;
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });

        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    // 补充
    addSome(item, index) {
        const params = {} as any;
        params.title = '补充信息';
        params.checker = [
            {
                checkerId: 'debtBank',
                required: false,
                type: 'text',
                options: {
                    readonly: true
                },
                title: '收款账号开户行',
                value: item.debtBank
            },
            {
                checkerId: 'province',
                required: true,
                type: 'dselect',
                title: '选择地区',
                validators: {},
                options: {
                    ref: 'chinaCity'
                },
                value: item.province
            },
            {
                checkerId: 'addressNO',
                required: true,
                type: 'text',
                title: '收款账号地区码',
                value: item.city
            },
            {
                checkerId: 'debtAccount',
                required: false,
                type: 'text',
                title: '收款账号',
                options: {
                    readonly: true
                },
                value: item.debtAccount
            },
            {
                checkerId: 'receivable',
                required: false,
                type: 'text',
                title: '金额',
                options: {
                    readonly: true
                },
                value: item.receivable
            },
            {
                checkerId: 'use',
                required: false,
                type: 'text',
                title: '汇款用途',
                options: {
                    readonly: true
                },
                value: item.use
            }
        ];

        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(x => {
            const j = JSON.parse(x.province);
            this.items[index] = Object.assign({}, this.items[index], {province: j.first, city: j.second, addressNO: x.addressNO});
            this.toValue();
        });
    }

    // 全部审核
    allPageChecked() {
        this.allCheckedStatus = !this.allCheckedStatus;
        if (this.allCheckedStatus) {
            this.data.forEach(item => item.checked = true);
            this.items.forEach(item => item.checked = true);
            this.selectItems = [...this.data];
        } else {
            this.data.forEach(item => item.checked = false);
            this.items.forEach(item => item.checked = false);
            this.selectItems = [];
        }
        this.toValue();
    }

    checkedSingle(item, index) {
        if (this.data[index].checked && this.data[index].checked === true) {
            this.data[index].checked = false;
            this.items[index].checked = false;
            this.selectItems = this.selectItems.filter((x: any) => x.checked);
        } else {
            this.data[index].checked = true;
            this.items[index].checked = true;
            // 选中则添加此项
            this.selectItems.push(this.data[index]);
        }
        // 判断是否达到全选
        if (this.selectItems.length === this.data.length) {
            this.allCheckedStatus = true;
        } else {
            this.allCheckedStatus = false;
        }
        this.toValue();
    }

    viewProcess(item) {
        this.bankManagementService.viewProcess(item.mainFlowId);
    }

    // 计算审批总金额
    calcAmount(): { num: number, amount: number } {
        if (this.selectItems.length && this.selectItems.length > 0) {
            const amount = this.selectItems.reduce((total, item) => total + parseFloat(item.receivable), 0);
            return {num: this.selectItems.length, amount};
        }
        return {num: 0, amount: 0};
    }

    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        // 复核流程情况下 ,且 不是会计下载流程
        if (!this.procedureId && this.row.checkerId !== 'downInfo_accounting') {
            this.items.forEach(c => c.checked ? c.checked = true : '');
            this.selectItems = this.items;
            this.allCheckedStatus = true;
            this.toValue();
        } else {
            // 如果this.items中存在checked字段，将this.items中的checked变为false
            this.items.forEach(c => c.checked ? c.checked = false : '');
        }
        this.data = this.items.map(c => Object.assign({}, c, {checked: false}));
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length !== this.selectItems.length) {
            this.ctrl.setValue('');
        } else {
            // 复核流程情况下，如果没有补充，不能提交
            if (!this.procedureId && this.row.checkerId !== 'downInfo_accounting') {
                let valid = true;
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].province === '' || this.items[i].city === '' || this.items[i].addressNO === '') {
                        valid = false;
                        break;
                    }
                }
                valid ? this.ctrl.setValue(JSON.stringify(this.items)) : this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(JSON.stringify(this.items));
            }
        }

        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
