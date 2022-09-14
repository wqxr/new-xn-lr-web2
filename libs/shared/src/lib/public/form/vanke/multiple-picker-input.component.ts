import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from '../xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MultiplePickerModalComponent } from './multiple-picker-modal.component';
import { PdfSignModalComponent } from '../../modal/pdf-sign-modal.component';
import { Params } from '@angular/router';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { CustomerAddCompanyModalComponent } from 'libs/products/avenger/src/lib/customer-manage/customer-addCompany-template/customer-addCompany.modal.component';
import { ContractAddCompanyModalComponent } from 'libs/products/avenger/src/lib/contract-manage/add-cotracttemplate/add-contracttemplate.component';


declare let $: any;

/**
 *  多项选择
 */
@Component({
    selector: 'app-xn-multiple-picker--input',
    templateUrl: './multiple-picker-input.component.html',
    styles: [
        `
            .xn-picker-label {
                display: inline-block;
                max-width: 95%
            }

            .inMemo {
                padding: 5px 0;
                color: #f20000
            }
        `,

    ]
})
export class MultiplePickerInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    inMemo = '';
    label;
    files: any[] = [];
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    heads = [
        { label: '供应商ID', value: 'appId' },
        { label: '供应商名称', value: 'orgName' },
        { label: '拼音', value: 'orgNameSpelling', hide: true }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
        { label: '声母', value: 'orgNameSyllable', hide: true }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
    ];
    // 根据checker项的checkerId配置
    config = {
        headquarters: {
            url: '/custom/common/headquarters/list',
            multiple: false,
            label: '总部公司',
            heads: [
                { label: '总部公司名称', value: 'orgName' }
            ],
            key: 'appId', // 过滤数组的键值对-key
            view: false,
            formatLabelValue: (data) => {
                return { orgName: data.orgName, appId: data.appId };
            }
        },
        aHeadquarters: {
            url: '/custom/contract_template/contract_template/get_orgs',
            multiple: false,
            label: '上游客户',
            heads: [
                { label: '总部公司名称', value: 'orgName' }
            ],
            key: 'appId', // 过滤数组的键值对-key
            view: false,
            formatLabelValue: (data) => {
                return { orgName: data.orgName, appId: data.appId };
            }

        },
        aSupplier: {
            url: '/custom/contract_template/contract_template/get_orgs',
            multiple: true,
            label: '万科供应商',
            heads: this.heads,
            key: 'appId',
            view: false,
            formatLabelValue: (data) => {
                return { orgName: data.orgName, appId: data.appId };
            }
        },
        aApplyTemplate: {
            url: '',
            multiple: true,
            label: '合同模板',
            heads: [{ label: '合同模板名称', value: 'label' }],
            key: 'id',
            view: true,
            formatLabelValue: (data) => {
                return data;
            }

        },
        specialSupplier: {
            url: '/relation/supplier?method=get',
            multiple: true,
            label: '供应商',
            heads: this.heads,
            key: 'appId',
            view: false,
            formatLabelValue: (data) => {
                return { orgName: data.orgName, appId: data.appId };
            }
        },
        applyTemplate: {
            url: '/custom/contract_template/template_list/list',
            multiple: true,
            label: '合同模板',
            heads: [{ label: '合同模板名称', value: 'label' }],
            key: 'id',
            view: true,
            formatLabelValue: (data) => {
                return data;
            }
        },
        agency: {
            url: '/llz/capital_list/get_agency',
            multiple: true,
            label: '中介机构',
            heads: [{ label: 'ID', value: 'appId' }, { label: '中介机构', value: 'appName' }],
            key: 'appId',
            view: false,
            formatLabelValue: (data) => {
                return { orgName: data.appName, appName: data.appName, appId: data.appId };
            }
        },
        // customerManager: {
        //     url: '/custom/avenger/customer_manager/manager_list',
        //     multiple: true,
        //     label: '管户客户经理',
        //     heads: this.manageheads,
        //     key: 'userId',
        //     view: false,
        //     formatLabelValue: (data) => {
        //         return { userName: data.userName, userId: data.userId };
        //     }
        // }

    };

    constructor(private xn: XnService,
                private er: ElementRef,
                private vcr: ViewContainerRef, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();
        });
        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.formatLabelByFiles();
        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     *  根据不同的checkerId 请求不同的接口，在去匹配已经上传的，在弹窗中初始选中的状态，单选时，不做初始状态处理
     * @param files 已经上传的文件
     */
    // 选择
    onSelect(files: any[]) {

        // 构建参数
        let psotParams = {} as any;
        if (this.row.checkerId === 'specialSupplier' || this.row.checkerId === 'aSupplier') {
            this.xn.loading.open();
            XnModalUtils.openInViewContainer(this.xn, this.vcr, CustomerAddCompanyModalComponent, { type: 1 })
                .subscribe(v => {
                    if (v === null) {
                        return;
                    } else {
                        this.files = XnUtils.distinctArray2(v, 'appId');
                        this.setValueByFiles();
                        this.formatLabelByFiles();
                    }
                });
        } else if (this.row.checkerId === 'applyTemplate' || this.row.checkerId === 'aApplyTemplate') {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractAddCompanyModalComponent, {})
                .subscribe(v => {
                    if (v === null) {
                        return;
                    } else {
                        this.files = XnUtils.distinctArray2(v, 'id');
                        this.setValueByFiles();
                        this.formatLabelByFiles();
                    }
                });


        } else {
            this.xn.loading.open();
            // 合同模版根据总部公司来匹配
            psotParams = { headquarters: this.localStorageService.caCheMap.get('headquarters') };
            this.xn.api.post(this.config[this.row.checkerId].url, psotParams).subscribe(x => {
                this.xn.loading.close();
                // 初始化已添加项状态
                if (this.config[this.row.checkerId].multiple) {
                    if (files.length && (x.data && x.data.data && x.data.data.length || x.data && x.data.lists && x.data.lists.length)) {
                        const lists = x.data.data || x.data.lists;
                        files.map(file => {
                            lists.forEach(list => {
                                if (file[this.config[this.row.checkerId].key] === list[this.config[this.row.checkerId].key]) {
                                    list.checked = true;
                                }
                            });
                        });
                    }
                }
                const params = {
                    heads: this.config[this.row.checkerId].heads,
                    data: x.data.data || x.data.lists || [],
                    multiple: this.config[this.row.checkerId].multiple,
                    total: x.data.recordsTotal || (x.data.data && x.data.data.length) || (x.data.lists && x.data.lists.length) || 0,
                    key: this.config[this.row.checkerId].key
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, MultiplePickerModalComponent, params).subscribe(v => {
                    if (v === null) {
                        return;
                    }
                    // 展示添加的值-并进行去重处理
                    if (this.config[this.row.checkerId].multiple) {
                        this.files = XnUtils.distinctArray2([...this.files, ...v.value], this.config[this.row.checkerId].key).map(item => {
                            return this.config[this.row.checkerId].formatLabelValue(item);
                        });
                    } else {
                        this.files = v.value; // 单选，则覆盖前面的值
                        // 存储值
                        this.localStorageService.setCacheValue('headquarters', v.value[0].orgName);
                    }
                    this.setValueByFiles();
                    this.formatLabelByFiles();
                });
            });


        }

    }

    // 删除
    onRemove(label, value) {
        this.files = this.files.filter((x: any) => x[label] !== value);
        this.setValueByFiles();
        this.ctrl.markAsDirty();
        this.calcAlertClass();
        this.formatLabelByFiles();
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

    private formatLabelByFiles() {
        if (this.files.length === 0) {
            this.label = '请点击右边按钮上传文件';
        } else {
            this.label = `已选择${this.files.length}项`;
        }
    }

    private setValueByFiles() {
        if (this.files.length === 0) {
            this.ctrl.setValue('');
        } else {
            const file = this.files.map(x => this.config[this.row.checkerId].formatLabelValue(x));
            this.ctrl.setValue(JSON.stringify(file));
        }
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
