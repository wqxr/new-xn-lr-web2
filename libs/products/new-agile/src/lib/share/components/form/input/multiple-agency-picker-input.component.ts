import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { BusinessMode } from 'libs/shared/src/lib/common/enums';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MultiplePickerModalComponent } from 'libs/shared/src/lib/public/form/vanke/multiple-picker-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

/**
 *  多项选择
 */
@Component({
    templateUrl: './multiple-agency-picker-input.component.html',
    styles: [
        `
            .xn-picker-label {
                display: inline-block;
                max-width: 95%;
            }

            .inMemo {
                padding: 5px 0;
                color: #f20000;
            }
        `,
    ],
})
@DynamicForm({ type: 'multiple-agency-picker', formModule: 'new-agile-input' })
export class MultipleAgencyPickerInputComponent implements OnInit {
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
        agency: {
            url: '/llz/capital_list/get_agency',
            multiple: true,
            label: '中介机构',
            heads: [
                { label: 'ID', value: 'appId' },
                { label: '中介机构', value: 'appName' },
            ],
            key: 'appId',
            view: false,
            formatLabelValue: (data) => {
                return {
                    orgName: data.appName,
                    appName: data.appName,
                    appId: data.appId,
                };
            },
        },
    };

    constructor(
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService
    ) {}

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.calcAlertClass();
        });
        // 设置初始值
        this.files = XnUtils.parseObject(this.ctrl.value, []);

        this.formatLabelByFiles();
        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(
            this.row,
            this.form,
            this.ctrl,
            this.er
        );
    }

    /**
     *  根据不同的checkerId 请求不同的接口，在去匹配已经上传的，在弹窗中初始选中的状态，单选时，不做初始状态处理
     * @param files 已经上传的文件
     */
    // 选择
    onSelect(files: any[]) {
        // 构建参数
        let psotParams = {} as any;

        this.xn.loading.open();
        // 合同模版根据总部公司来匹配
        psotParams = {
            headquarters: this.localStorageService.caCheMap.get('headquarters'),
            modelId: BusinessMode.Yjl,
        };
        this.xn.api
            .post(this.config[this.row.checkerId].url, psotParams)
            .subscribe((x) => {
                this.xn.loading.close();
                // 初始化已添加项状态
                if (this.config[this.row.checkerId].multiple) {
                    if (
                        files.length &&
                        ((x.data && x.data.data && x.data.data.length) ||
                            (x.data && x.data.lists && x.data.lists.length))
                    ) {
                        const lists = x.data.data || x.data.lists;
                        files.map((file) => {
                            lists.forEach((list) => {
                                if (
                                    file[
                                        this.config[this.row.checkerId].key
                                    ] ===
                                    list[this.config[this.row.checkerId].key]
                                ) {
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
                    total:
                        x.data.recordsTotal ||
                        (x.data.data && x.data.data.length) ||
                        (x.data.lists && x.data.lists.length) ||
                        0,
                    key: this.config[this.row.checkerId].key,
                };
                XnModalUtils.openInViewContainer(
                    this.xn,
                    this.vcr,
                    MultiplePickerModalComponent,
                    params
                ).subscribe((v) => {
                    if (v === null) {
                        return;
                    }
                    // 展示添加的值-并进行去重处理
                    if (this.config[this.row.checkerId].multiple) {
                        this.files = XnUtils.distinctArray2(
                            [...this.files, ...v.value],
                            this.config[this.row.checkerId].key
                        ).map((item) => {
                            return this.config[
                                this.row.checkerId
                            ].formatLabelValue(item);
                        });
                    } else {
                        this.files = v.value; // 单选，则覆盖前面的值
                        // 存储值
                        this.localStorageService.setCacheValue(
                            'headquarters',
                            v.value[0].orgName
                        );
                    }
                    this.setValueByFiles();
                    this.formatLabelByFiles();
                });
            });
    }

    // 删除
    onRemove(label, value) {
        this.files = this.files.filter((x) => x[label] !== value);
        this.setValueByFiles();
        this.ctrl.markAsDirty();
        this.calcAlertClass();
        this.formatLabelByFiles();
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
            const file = this.files.map((x) =>
                this.config[this.row.checkerId].formatLabelValue(x)
            );
            this.ctrl.setValue(JSON.stringify(file));
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
