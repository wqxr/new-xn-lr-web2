import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'common-sign-code-modal-component',
    templateUrl: './common-sign-cfca-code-modal.component.html',
    styles: [
        `
        .spanClass{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #1F2B38;
            letter-spacing: 0;
            padding-left:40px;
        }
            .ipt-fake-box {
                text-align: center;
            }
            .input {
                display: inline-block;
            }
            .input:last-child {
                border-right: 1px solid #999;
            }
            input.my_input {
                border-top: 1px solid #999;
                border-bottom: 1px solid #999;
                border-left: 1px solid #999;
                width: 50px;
                height: 34px;
                outline: none;
                font-family: inherit;
                font-size: 16px;
                text-align: center;
                line-height: 34px;
                color: #1F2B38;
                background: rgba(255, 255, 255, 0);
                margin-right: 15px;
                border: 1px solid #D3D3D3;
                border-radius: 2px;
                border-radius: 2px;
            }
        .buttonclass{
            width: 86px;
            height: 34px;
            margin: 34px auto;
        }
        .btnclass{
            background: #1D67C7;
            border-radius: 2px;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 14px;
        }
            `
    ],
})
export class CfcaCommonSignCodeModalComponent implements OnInit {

    private observer: any;
    alertMsg = '';
    btnText = '获取验证码';
    btnEnabled = true;
    time = 0;
    timer: any = null;
    processing = false;
    public active = 0;
    inputBtn: any;
    codeText: any[] = ['', '', '', '', '', ''];
    sms_params: any;
    codes = '';
    phoneNumber: '';
    isClick = false;
    headTitle = '';
    keyCode = false;
    @ViewChild('modal') modal: ModalComponent;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }


    ngOnInit() {
    }


    open(paramContracts: any): Observable<any> {
        // this.modal.open();
        this.sms_params = paramContracts;
        this.headTitle = '合同签署意愿性校验';
        this.phoneNumber = paramContracts.phone;
        this.modal.open(ModalSize.Small, 'specialModel');
        this.modal.instance.hidden.subscribe(() => {
            this.modal.instance.destroy().subscribe();
        });
        window.setTimeout(() => {
            const firstInput = document.getElementById('firstInput0');
            firstInput.focus();
        }, 50);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }
    checkSms(codeS: string) {
        this.xn.api.dragon.post('/cfca/ca_sign_check_sms', {
            smsCode: codeS,
            fileId: this.sms_params.fileId,
            recordId: this.sms_params.recordId,
        }).subscribe(x => {
            if (x.ret === 0) {
                this.close({ action: 'ok', contract: x.data.contract, fileObj: x.data.fileObj });
            }
        });
    }

    listenKeyUp(event, type) {
        if (type !== 5 && event.keyCode !== 8 && this.codeText[type] !== '') {
            window.setTimeout(() => { document.getElementById(`firstInput${type + 1}`).focus(); }, 50);
        }
    }
    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    onCancel() {
        this.close({ action: 'cancel' });
    }
    submit() {
        this.isClick = true;
        this.checkSms(this.codes);
    }
    invalid() {
        this.codes = this.codeText.join().replace(/,/g, '');
        if (this.codes.length === 6 && !this.isClick) {
            return true;
        } else if (this.isClick) {
            return false;
        }
    }
    deleteValue(event: any, type: number) {
        if (event.keyCode === 8 && this.codeText[type] === '') { // 删除键
            if (type > 0) {
                window.setTimeout(() => { document.getElementById(`firstInput${type - 1}`).focus(); }, 50);
            }
        }

    }
}
