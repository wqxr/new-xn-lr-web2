import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'sh-reject-modal',
    templateUrl: './reject-modal.component.html',
    styles: [`
        .edit-content {
            display: flex;
            flex-flow: column;
        }

        .edit-content-flex {
            flex: 1;
            text-align: center;
            overflow-y: scroll;
            background: #E6E6E6;
        }

        .button-group {
            float: right;
            padding: 0 15px;
        }

        .add {
            position: fixed;
            left: 15px;
        }
    `]
})
export class ShRejectModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    public mainForm: FormGroup;
     // 回退企业信息
    public params = {
        projectCompany: '',
        debtUnit: '',
        receive: '',
    };
    pageTitle = '拒绝';
    rejectInfo: any[] = [];
    datainfo: any[] = [];
    reason = '';
    question = '';
    public constructor(public xn: XnService,
                       public vcr: ViewContainerRef) {
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.rejectInfo = [
            { label: 'contract', checked: false, value: '合同', contract: false },
            { label: 'invoice', checked: false, value: '发票', invoice: false },
            { label: 'certificateFile', checked: false, value: '资质证明', certificateFile: false },
            { label: 'accessInfo', checked: false, value: '准入资料', accessInfo: false },
            { label: 'otherFile', checked: false, value: '其他文件', otherFile: false },
        ];
        this.modal.open(ModalSize.XLarge);

        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public handleCancel() {
        this.close({
            action: 'cancel'
        });
    }

    public handleSubmit() {
        const newObj = {
            contract: this.rejectInfo[0].contract,
            invoice: this.rejectInfo[1].invoice,
            certificateFile: this.rejectInfo[2].certificateFile,
            accessInfo: this.rejectInfo[3].accessInfo,
            otherFile: this.rejectInfo[4].otherFile
        };
        const obj = Object.assign({}, { content: newObj, rejectReason: this.reason, desc: this.question });
        this.close({
            action: 'ok',
            rejectInfo: obj,
            type: 1,
        });
    }
    // 中止流程
    terminate() {
        this.close({
            action: 'ok',
            type: 0
        });

    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    /**
   * 单选
   * @param e
   * @param item
   * @param index
   */
    public singelChecked(items, con) {
        if (items.checked && items.checked === true) {
            items.checked = false;
            items[items.label] = false;
            this.remove(con, this.datainfo);
        } else {
            items.checked = true;
            items[items.label] = true;
            this.datainfo.push({});
            this.datainfo = Array.from(new Set(this.datainfo));

        }
    }

    remove(value, array: any[]) {
        const index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    }


}
