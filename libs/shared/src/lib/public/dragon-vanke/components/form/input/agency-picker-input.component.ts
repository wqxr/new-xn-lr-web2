import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MultiplePickerModalComponent } from '../../../modal/multiple-picker-modal.component';
import { VankeAddAgencyModalComponent } from '../../../modal/vanke-addAgency.modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../../public/form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


/**
 *  中介机构设置
 */
@Component({
    selector: 'app-xn-agency-picker-input',
    templateUrl: './agency-picker-input.component.html',
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
@DynamicForm({ type: 'agency-picker', formModule: 'dragon-input' })
export class AgencyPickerInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    inMemo = '';
    label;
    list: any[] = [];
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    project_manage_id: string = '';
    delIds: string[] = [];
    heads = [
        { label: '供应商ID', value: 'appId' },
        { label: '供应商名称', value: 'orgName' },
        { label: '拼音', value: 'orgNameSpelling', hide: true }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
        { label: '声母', value: 'orgNameSyllable', hide: true }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
    ];
    // 根据checker项的checkerId配置
    config = {
        agency: {
            url: '/llz/capital_list/get_agency',
            multiple: true,
            label: '中介机构',
            heads: [{ label: 'ID', value: 'appId' }, { label: '中介机构', value: 'appName' }],
            key: 'appId',
            formatLabelValue: (data) => {
                return { orgName: data.appName, appName: data.appName, appId: data.appId };
            }
        },
        vankeAgency: {
            formatLabelValue: (data) => {
                return { appId: data.appId, orgName: data.orgName, userId: data.userId, userName: data.userName, agencyType: data.agencyType };
            }
        },
        longAgency: {
            formatLabelValue: (data) => {
                return { orgName: data.orgName, appName: data.appName, appId: data.appId, agencyType: data.agencyType };
            }
        },
    };


    constructor(private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.calcAlertClass();
        });
        this.project_manage_id = this.row.options.helpMsg;
        // 设置初始值
        this.vankeOperate();
        if (this.row.name !== 'vankeAgency' && this.row.name !== 'longAgency') {
            this.list = XnUtils.parseObject(this.ctrl.value, []);
        }
        this.formatLabelByFiles();
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }


    vankeOperate() {

        if (this.row.name === 'vankeAgency' || this.row.name === 'longAgency') {
            this.project_manage_id = this.ctrl.value;
            this.xn.dragon.post('/project_manage/agency/project_agency_list',
                { project_manage_id: this.project_manage_id }).subscribe(x => {
                    if (x.ret === 0) {
                        this.list = x.data.rows;
                        if (this.list.length !== 0) {
                            this.ctrl.setValue(JSON.stringify(this.list));
                        } else {
                            this.ctrl.setValue('');
                        }
                        // this.setValueByFiles();
                        this.formatLabelByFiles();

                    }
                });
        }
    }

    /**
     *  回显初始选中的状态；单选时，不做初始状态处理
     * @param selected 已经上传的文件
     */
    // 选择
    onSelect(selected: any[]) {

        if (this.row.name === 'agency') {
            // 构建参数
            let postParams = {};
            this.xn.loading.open();
            // 合同模版根据总部公司来匹配
            postParams = { headquarters: this.localStorageService.caCheMap.get('headquarters') };
            this.xn.api.post(this.config[this.row.checkerId].url, postParams).subscribe(x => {
                this.xn.loading.close();
                // 初始化已添加项状态
                if (this.config[this.row.checkerId].multiple) {
                    const hasData = (x.data && x.data.data && x.data.data.length) || (x.data && x.data.lists && x.data.lists.length);
                    if (selected.length && hasData) {
                        const lists = x.data.data || x.data.lists;
                        selected.map(item => {
                            lists.forEach(list => {
                                if (item[this.config[this.row.checkerId].key] === list[this.config[this.row.checkerId].key]) {
                                    list['checked'] = true;
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
                        this.list = XnUtils.distinctArray2([...this.list, ...v.value], this.config[this.row.checkerId].key).map(item => {
                            return this.config[this.row.checkerId].formatLabelValue(item);
                        });
                    } else {
                        this.list = v.value; // 单选，则覆盖前面的值
                        // 存储值
                        this.localStorageService.setCacheValue('headquarters', v.value[0].orgName);
                    }
                    this.setValueByFiles();
                    this.formatLabelByFiles();
                });
            });
        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeAddAgencyModalComponent,
                {
                    project_manage_id: this.project_manage_id,
                    agencyType: this.row.options.helpType,
                    rowName: this.row.name,
                    value: this.ctrl.value
                })
                .subscribe((v) => {
                    if (v === null) {
                        return;
                    } else {
                        this.list = v.value; // 单选，则覆盖前面的值
                        this.setValueByFiles();
                        this.formatLabelByFiles();
                    }
                });
        }

    }

    // 删除
    onRemove(label, value) {
        this.list = this.list.filter(x => x[label] !== value);
        this.setValueByFiles();
        this.ctrl.markAsDirty();
        this.calcAlertClass();
        this.formatLabelByFiles();
        // if (this.row.name === 'agency') {
        //     this.list = this.list.filter(x => x[label] !== value);
        //     this.setValueByFiles();
        //     this.ctrl.markAsDirty();
        //     this.calcAlertClass();
        //     this.formatLabelByFiles();
        // } else {
        //     this.delIds.push(value);
        //     this.xn.dragon.post('/project_manage/agency/add_agency',
        //         { project_manage_id: this.project_manage_id, addIds: [], delIds: this.delIds }).subscribe(x => {
        //             if (x.ret === 0) {
        //                 // this.close({ action: 'ok', value: this.selectedItems });
        //                 this.list = this.list.filter(x => x[label] !== value);
        //                 this.setValueByFiles();
        //                 this.ctrl.markAsDirty();
        //                 this.calcAlertClass();
        //                 this.formatLabelByFiles();
        //             }
        //         });
        // }
    }

    private formatLabelByFiles() {

        this.label = this.list.length === 0 ? '请点击右边按钮选择' : `已选择${this.list.length}项`;
    }

    private setValueByFiles() {
        if (this.list.length === 0) {
            this.ctrl.setValue('');
        } else {
            let obj: any;
            if (this.row.name === 'agency') {
                obj = this.list.map(x => this.config[this.row.checkerId].formatLabelValue(x));
            } else {
                obj = this.list.map(x => this.config['vankeAgency'].formatLabelValue(x));
            }
            this.ctrl.setValue(JSON.stringify(obj));
        }
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}