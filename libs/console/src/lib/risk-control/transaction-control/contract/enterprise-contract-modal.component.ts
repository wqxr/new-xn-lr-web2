
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalComponent, ModalSize} from 'libs/shared/src/lib/common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
/**
 *  企业合同修改
 */
@Component({
    templateUrl: './enterprise-contract-modal.component.html',
    styles: [`
        .required-star::after {
            content: '*';
            color: #ff5500;
        }

        .contract {
            max-height: calc(100vh - 260px);
        }

        .pdf-container {
            width: 100%;
            height: calc(100vh - 300px);
            border: none;
        }

        .text-padding {
            padding: 10px;
        }

        .fa-color {
            color: #FF0000;
        }
    `]
})
export class EnterpriseContractModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('szca') szca: ElementRef;
    observer: any;
    table: any; // 默认值
    rows: any[] = [];
    mainForm: FormGroup;
    pageTitle = '合同编辑';
    ocx: any;
    params: any;
    contractDateStatus: any[] = SelectOptions.get('contractDateStatus');
    contractValidityType: any; // 合同有效期类型
    contractValidity: any; // 合同有效期
    private readonly data = [
        {
            title: '合同名称',
            checkerId: 'label',
            type: 'text',
            options: {readonly: true},
            required: 1
        }, {
            title: '交易ID',
            checkerId: 'mainFlowId',
            options: {readonly: true},
            type: 'text',
            required: 1
        }, {
            title: '合同签署时间',
            checkerId: 'signContractTime',
            options: {readonly: true},
            type: 'date',
            required: 1
        },
        {
            title: '是否首次业务',
            checkerId: 'isFirst',
            type: 'select',
            options: {ref: 'bussStatus', readonly: true},
            required: 1
        }
    ];

    constructor(private xn: XnService) {
    }

    ngOnInit() {
    }

    open(params: any): Observable<any> {
        this.params = params;
        this.rows = this.data; // 默认
        this.init(this.rows, params);
        this.contractValidityType = params.contractValidityType || '';
        this.contractValidity = params.contractValidity || '';
        this.modal.open(ModalSize.Large);
        // 在表单初始化后加载合同
        this.createOcx();
        this.displaySign(params);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    // 返回信息
    save() {
        this.close({action: 'ok', value: {contractValidityType: this.contractValidityType, contractValidity: this.contractValidity}});
    }

    onCancel() {
        this.close(null);
    }

    dateInput(e) {
        this.contractValidity = e.value || '';
    }

    changeSelect(val) {
        if (val === '长期') { // 选择长期的话，清除有效日期
            this.contractValidity = '';
        }
    }

    close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    init(rows, params) {
        rows.forEach(x => {
            x.value = params[x.checkerId]; // 赋值
            if (x.checkerId === 'signContractTime') {
                x.value = XnUtils.formatDate(params[x.checkerId]);
            }
            if (x.checkerId === 'isFirst') {
                x.value = params[x.checkerId] === true ? 1 : 0;
            }

        });
        XnFormUtils.buildSelectOptions(rows);
        this.buildChecker(rows);
        this.mainForm = XnFormUtils.buildFormGroup(rows);
    }

    private createOcx() {
        // szca的控件需要这样动态创建
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';

        if (navigator.userAgent.indexOf('MSIE') > 0) {
            div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        } else if (navigator.userAgent.indexOf('Chrome') > 0) {
            div.innerHTML = `<embed id="PDFReader" type="application/x-lrscft-activex"
                style="left: 0; top: 0; width: 100%; height:100%;" clsid='{27DD22AC-F026-49FB-8733-AABB4DA82B8C}'>`;
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            div.innerHTML = `<object id="PDFReader" type="application/x-lrscft-activex" align='baseline' border='0'
                style="left: 0; top: 0; width: 100%; height:100%;" clsid="{27DD22AC-F026-49FB-8733-AABB4DA82B8C}"></object>`;
        } else {
            div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
        }

        this.szca.nativeElement.appendChild(div);
        this.ocx = document.getElementById('PDFReader');

        this.showOrHide();
    }

    // 控件工具隐藏
    showOrHide() {
        try {
            const tools = [
                {index: 1, show: 0}, {index: 2, show: 0}, {index: 3, show: 1}, {index: 4, show: 0},
                {index: 5, show: 0}, {index: 6, show: 0}, {index: 7, show: 0}, {index: 8, show: 0},
                {index: 9, show: 0}, {index: 10, show: 0}
            ];
            tools.forEach(tool => {
                this.ocx.SZCA_SetToolButtomShowHide(tool.index, tool.show);
            });
        } catch {
            //
        }
    }

    // 显示合同
    private displaySign(params: any) {
        console.log('需要验证的合同：', params);
        this.xn.api.post3('/contract/json', {
            id: params.id,
            secret: params.secret
        }).subscribe(json => {
            try {
                const ret = this.ocx.SZCA_LoadFromString(json.data);
                if (ret !== 0) {
                    alert(this.ocx.SZCA_GetErrMsg(ret));
                    return;
                }
            } catch (error) {
                console.warn(error);
            }
        });
        // }
    }

    private isOcxEnabled(): boolean {
        try {
            const err = this.ocx.SZCA_GetLastErrCode();
            return true;
        } catch (e) {
            return false;
        }
    }
}
