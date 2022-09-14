import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {PublicCommunicateService} from 'libs/shared/src/lib/services/public-communicate.service';
import {XnInputOptions} from '../xn-input.options';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';

/**
 *  协议变更
 */
@Component({
    selector: 'app-xn-info-change',
    templateUrl: './info-change.component.html',
    styles: [`
        .required-star::after {
            content: '*';
            color: #ff5500;;
        }

        .mr {
            margin-right: 20px;
        }
    `]
})
export class InfoChangeComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    // 但选项
    public options: OutputModel[] = [
        {label: '业务变更', value: '业务变更'},
        {label: '暂停交易', value: '暂停交易'},
        {label: '恢复交易', value: '恢复交易'},
        {label: '修改密码', value: '修改密码'},
        {label: '注销账户', value: '注销账户'},
        {label: '终止协议', value: '终止协议'},
    ];
    public rows: any[];
    // 默认显示
    public mainForm: FormGroup;
    private changeTypeValue = '';
    private readonly defRows: any[] = [
        {
            title: '业务变更',
            checkerId: 'changeType',
            type: 'select1',
            flowId: 'financing12',
            required: true,
            options: {ref: 'changeDeal'},
        }, {
            title: '变更前信息',
            checkerId: 'changeBeforeInfo',
            type: 'text',
            flowId: 'financing12',
            required: true,
        }, {
            title: '变更后信息',
            checkerId: 'changeAfterInfo',
            type: 'text',
            flowId: 'financing12',
            required: true,
        }, {
            title: '变更原因',
            checkerId: 'changeReason',
            type: 'text',
            flowId: 'financing12',
            required: true,
        },
    ];
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    public constructor(private publicCommunicateService: PublicCommunicateService,
                       private xn: XnService,
                       private er: ElementRef,
                       private localStorageService: LocalStorageService) {
        this.publicCommunicateService.change.subscribe(x => {
            // 如果选择其他，已存在‘其他’项则不添加，否则添加其他输入列。否则，为默认列
            if (x === '其他') {
                const find = this.rows.find(y => y.checkerId === 'other');
                if (!find) {
                    this.rows = [...this.rows, ...[{
                        title: '其他',
                        checkerId: 'other',
                        type: 'text',
                        flowId: 'financing12',
                        required: true,
                    }]];
                }
            } else {
                this.rows = this.defRows;
            }
            this.build(this.rows);
        });
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 默认勾选
        this.options[0].checked = true;
        // 默认存储第一项
        this.localStorageService.setChangeDelType(this.options[0].value);
        // 构造checker项  默认显示
        this.rows = this.defRows;
        this.build(this.rows);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public handleChange(val: any) {
        this.changeTypeValue = val;
        this.localStorageService.setChangeDelType(val); // 保存选中修改类型
        if (val === '暂停交易' || val === '恢复交易' || val === '修改密码') {
            this.rows = [
                {
                    title: '申请人预留收款/付款账号',
                    checkerId: 'reservedAccount',
                    type: 'text',
                    flowId: 'financing12',
                    required: true,
                }, {
                    title: '申请原因',
                    checkerId: 'applyReason',
                    type: 'text',
                    flowId: 'financing12',
                    required: true,
                }
            ];
        } else if (val === '注销账户') {
            this.rows = [
                {
                    title: '注销账户',
                    checkerId: 'logoutAccount',
                    type: 'text',
                    flowId: 'financing12',
                    required: true,
                }
            ];
        } else if (val === '终止协议') {
            this.rows = [
                {
                    title: '托管协议编号',
                    checkerId: 'agreementNumber',
                    type: 'text',
                    flowId: 'financing12',
                    required: true,
                }, {
                    title: '子账户余额',
                    checkerId: 'subBalance',
                    type: 'money',
                    flowId: 'financing12',
                    required: true,
                },
            ];
        } else {
            this.rows = this.defRows;
        }
        this.build(this.rows);
    }

    // 设置修改值
    public init() {
        if (this.changeTypeValue === '') {
            this.changeTypeValue = this.options[0].value;
        }
        if (this.changeTypeValue === '业务变更') {
            this.mainForm.value.changeType = this.localStorageService.caCheValue.changeType;
        }
        const value = {
            typeChange: this.changeTypeValue,
            itemChange: this.mainForm.value
        };
        this.ctrl.setValue(value);
    }

    private build(row) {
        XnFormUtils.buildSelectOptions(row);
        this.buildChecker(row);
        this.mainForm = XnFormUtils.buildFormGroup(row);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}

export class OutputModel {
    public label: string;
    public value: string;
    public checked?: boolean;
}
