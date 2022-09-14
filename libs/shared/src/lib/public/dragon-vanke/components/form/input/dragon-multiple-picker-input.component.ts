import { Component, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Observable, of, fromEvent } from 'rxjs';

import { OnceContractMultipeSelectModalComponent } from '../../../modal/once-contract-template-multipe-modal.component';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { SelectOptions } from '../../../../../config/select-options';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { PdfSignModalComponent } from '../../../../modal/pdf-sign-modal.component';
import { ContractManagerEnum } from 'libs/shared/src/lib/config/enum/common-enum';

declare let $: any;

/**
 *  多项选择
 */
@Component({
    selector: 'app-xn-dragon-multiple-picker-input',
    templateUrl: './dragon-multiple-picker-input.component.html',
    styles: [
        `
        .inMemo {
            padding: 5px 0;
            color: #f20000
        }
        .table-head table,.table-body table{
            margin-bottom: 0px
        }
        .table-body{
            width:100%;
            max-height:400px;
            overflow-y:auto;
            min-height:50px;
        }
        .table-body table tr:nth-child(2n+1){
            background-color:#f9f9f9;
        }
        table thead,tbody tr {
            display:table;
            width:100%;
            table-layout:fixed;
        }
        .table-head table tr th {
            border:1px solid #cccccc30;
            text-align: center;
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
        }
    `,

    ]
})
@DynamicForm({ type: 'multiple-picker', formModule: 'dragon-input' })
export class DragonMultiplePickerInputComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    inMemo = '';
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    HeadquartersCtrl: AbstractControl; // 使用总部公司（新增一次转让合同）
    xnOptions: XnInputOptions;

    items: any[] = [];   // 已选项目/收款单位/合同模板
    originalItems: any[] = [];   // 已选项目/收款单位/合同模板
    selectValue = ''; // 修改流程显示已有值
    selectType = false;  // 通用false/非通用true
    isDisabled = false; // 删除流程不可修改
    subResize: any;
    // 根据checker项的checkerId配置
    config = {
        fitProject: {
            url: '',
            multiple: true,
            label: '适用项目',
            heads: [{ label: '适用项目', value: 'projectName', width: '94%', type: 'text' }],
            key: 'projectName',  // 去重唯一标识
            view: true,  // 是否可点击查看
            formatLabelValue: (data) => {
                return data;
            }
        },
        fitDebtUnit: {
            url: '',
            multiple: true,
            label: '适用收款单位',
            heads: [{ label: '适用收款单位', value: 'orgName', width: '94%', type: 'text' }],
            key: 'orgName',
            view: true,
            formatLabelValue: (data) => {
                return data;
            }
        },
        contractTemplate: {
            url: '',
            multiple: true,
            label: '合同模板',
            heads: [{ label: '合同模板', value: 'templateFile', width: '94%', type: 'contract' }],
            key: 'templateName',
            view: true,
            formatLabelValue: (data) => {
                return data;
            }
        },

    };

    constructor(private xn: XnService, private er: ElementRef, private cdr: ChangeDetectorRef,
        private vcr: ViewContainerRef, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        console.log(this.row);
        this.ctrl = this.form.get(this.row.name);

        this.row.selectOptions = SelectOptions.get('applyOptions');
        this.isDisabled = this.row.flowId === 'sub_first_contract_delete' ? true : false;
        this.ctrl.statusChanges.subscribe(s => {
            this.calcAlertClass();
        });
        // this.ctrl.valueChanges.subscribe(v => {
        //     this.calcAlertClass();
        // });
        // 设置初始值
        if (!!this.row.value && JSON.parse(this.row.value) && this.judgeDataType(JSON.parse(this.row.value)) && JSON.parse(this.row.value)[0] === '通用') {
            this.selectValue = '通用';
            this.selectType = false;
        } else if (!!this.row.value) {
            this.selectValue = '非通用';
            this.selectType = true;
            this.items = XnUtils.parseObject(this.ctrl.value, []);
            let itemsTemp = [];
            if (this.row.checkerId === 'fitProject') {
                itemsTemp = JSON.parse(this.row.value).map((p) => {
                    return { projectName: p };
                });
            } else if (this.row.checkerId === 'fitDebtUnit') {
                itemsTemp = JSON.parse(this.row.value).map((d) => {
                    return { orgName: d };
                });
            } else if (this.row.checkerId === 'contractTemplate') {
                itemsTemp = JSON.parse(this.row.value).map((c) => {
                    return { contractId: c.contractId, templateName: c.label, templateType: c.templateType, templateFile: JSON.stringify([c]) };
                });
            }
            this.originalItems = Object.assign(itemsTemp, []);
        }
        // this.items = XnUtils.parseObject(this.ctrl.value, []);

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        // 一转让合同组新增 根据总部公司查询合同模板
        if (this.row.checkerId === 'contractTemplate') {
            this.HeadquartersCtrl = this.form.get('headquarters');
            this.HeadquartersCtrl.valueChanges.subscribe(v => {
                if (this.row.checkerId === 'contractTemplate') {
                    this.items = [];
                    this.originalItems = [];
                    this.ctrl.setValue('')
                    this.cdr.markForCheck();
                }
            })
        }

        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    ngAfterViewInit() {
        this.formResize();
    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    formResize() {
        const scrollBarWidth = $('.table-body', this.er.nativeElement).outerWidth(true) - $('.table-body>table').outerWidth(true);
        $('.table-head', this.er.nativeElement).css({ 'padding-right': scrollBarWidth ? scrollBarWidth + 'px' : '0px' });
    }
    onSelectChange(val) {
        switch (val) {
            case '通用':
                this.selectType = false;
                this.ctrl.setValue(JSON.stringify([val]));
                break;
            case '非通用':
                this.selectType = true;
                this.setValueByFiles();
                break;
            default:
                this.selectType = false;
                this.ctrl.setValue('');
                this.alert = '必填字段';
                this.form.setErrors({ error: '必填字段' });
                break;
        }
        // console.log(this.form.value);
    }

    /**
     *  根据不同的checkerId 请求不同的接口，在去匹配已经上传的，在弹窗中初始选中的状态，单选时，不做初始状态处理
     */
    // 选择
    onSelect() {

        // 构建参数
        const obj = {
            originalItems: this.originalItems,
            checkerId: this.row.checkerId,
            key: this.config[this.row.checkerId].key,
            headquarters: this.form.get('headquarters') ? this.form.get('headquarters').value : ''
        };
        const params = Object.assign(obj, {});   // this.config
        XnModalUtils.openInViewContainer(this.xn, this.vcr, OnceContractMultipeSelectModalComponent, params)
            .subscribe(v => {
                if (v.action === 'cancel') {
                    return;
                } else if (v.action === 'ok') {
                    this.originalItems = v.value && v.value.length > 0 ? XnUtils.distinctArray2(v.value, v.key) : [];
                    if (this.row.checkerId !== 'contractTemplate') {
                        this.items = this.originalItems.map((p) => {
                            return p[v.key];
                        });
                    } else {
                        this.items = this.originalItems.map((c) => {
                            const templateFile = JSON.parse(c.templateFile);
                            templateFile.forEach((file) => {
                                file.templateType = c.templateType;
                                file.contractId = c.id || c.contractId;
                            });
                            return templateFile[0];
                        });
                    }
                    this.setValueByFiles();
                }
            });
    }

    // 当为合同模板时，可查看合同
    viewDetail(file) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: file.id,
            secret: file.secret,
            label: file.label,
            readonly: true
        }).subscribe(() => {
        });
    }

    private setValueByFiles() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        } else {
            const file = this.items.map(x => this.config[this.row.checkerId].formatLabelValue(x));
            this.ctrl.setValue(JSON.stringify(file));
        }
    }
    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    // 删除
    // onRemove(label, value) {
    //     this.items = this.items.filter((x: any) => x[label] !== value);
    //     this.setValueByFiles();
    //     this.ctrl.markAsDirty();
    //     this.calcAlertClass();
    // }
    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        if (this.row.flowId === 'sub_first_contract_modify') { // 判断是不是一次转让合同组
            const paramId = con.contractId;
            this.xn.loading.open();
            this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file', { id: paramId, type: ContractManagerEnum.ONCE_CONTRACT_MANAGE }).subscribe(x => {
                if (x.ret === 0) {
                    this.xn.loading.close();
                    const data = JSON.parse(x.data)[0];
                    const params = Object.assign({}, data, { readonly: true });
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
                    });
                }
            })
        } else {
            const params = Object.assign({}, con, { readonly: true });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
            });
        }

    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
}
