import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    selector: 'lib-sh-audit-standard-modal',
    templateUrl: './audit-standard-modal.component.html',
    styles: [`
        .edit-content {
            display: flex;
            flex-flow: column;
            height: 400px;
    overflow-y: scroll;
        }
        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: scroll;
            background: #E6E6E6;
        }
        .table > tbody > tr > td{
            border:0px;
        }
        .button-group {
            float: right;
            padding: 0 15px;
        }
        .bold-text {
            font: bolder 15px sans-serif;
        }
        .text-dangerous {
            color: #f81414;
        }
    `]
})

export class ShAuditStandardModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
    public shows: any[];
    public params: any;
    pageTitle = '审核标准';
    private auditStandard = {
        invoiceIssuer: '发票出票人',
        payeeName: '收款单位名称',
        referenceStandard: '参考标准',
        invoiceReceiver: '发票收票人',
        projectCompanyName: '项目公司名称',
        contractAwardPeriod: '合同签订日期',
        invoiceDate: '发票开票日期',
        basicContractPartyAName: '基础合同甲方名称',
        basicContractPartyBName: '基础合同乙方名称',
        contractualPaymentAccount: '合同约定付款金额',
        actualPaymentAccount: '实际付款金额',
        invoicesRepeatedlySubmit: '重复提交的发票',
        // 'invoiceNumber': '重复提交的发票号码',
        qichachaEnterpriseName: '企查查企业名称',
        legalRepresentName: '法定代表人姓名',
        qichachaLegalRepresentName: '企查查法定代表人姓名',
    };
    public constructor(public xn: XnService,
                       public vcr: ViewContainerRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {

        params.checkers.forEach((item, index) => {
            const itemArr = item.itemId;
            itemArr.forEach((val) => {
                if (this.judgeDataType(item[val]) && item[val].length) {
                    const flag = item[val].every((currentValue) => {
                        return currentValue;
                    });
                    if (flag) {
                        item[val] = this.arrUnique(item[val]).length > 2 ? this.arrUnique(item[val]).slice(0, 2).join(',').concat('等') : this.arrUnique(item[val]).join(',');
                    }
                }
            });
            if (itemArr.includes('invoiceNumber')) {
                item.standardCss = item.referenceStandard === '无' ? 'text-primary' : 'text-dangerous';
            } else {
                item.standardCss = 'text-muted';
            }
            item.relationCss = item.referenceStandard.includes(item.relation) ? 'text-primary' : 'text-dangerous';
        });
        this.params = params.value;
        this.shows = params.checkers || [];
        this.buildFormGroup();
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    /**
     * 数组去重
     */
    private arrUnique(arrs) {
        if (!arrs || arrs.length === 0) {
            return;
        }
        const hash = {} as any;
        arrs = arrs.reduce(function(item, next) {
            hash[next] ? '' : hash[next] = true && item.push(next);
            return item;
        }, []);
        return arrs;
    }
    /**
     *  判断数据类型
     * @param paramValue
     */
    public judgeDataType(paramValue: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(paramValue);
        } else {
            return Object.prototype.toString.call(paramValue) === '[object Array]';
        }
    }
    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public handleSubmit() {
        const obj = Object.assign({}, this.mainForm.value);
        this.close({
            action: 'ok',
            contractType: obj
        });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    /**
     *  构建表单控件
     */
    private buildFormGroup() {
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
