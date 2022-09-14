import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnService } from '../../services/xn.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'code-modal-component',
    templateUrl: './cfca-code-modal.component.html',
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
export class CfcaCodeModalComponent implements OnInit {

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
    services = '';
    codes = '';
    phoneNumber: '';
    isClick = false;
    headTitle = '';
    keyCode = false;
    @ViewChild('modal') modal: ModalComponent;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }


    ngOnInit() {
        // $(document).keydown(function (event) {
        //     let that = this;
        //     if (event.keyCode === 8) { // 删除键
        //         that.codes = that.codeText.join().replace(/,/g, '');
        //         if (that.codes.length > 1) {
        //             that.codeText[that.codes.length] = '';
        //             window.setTimeout(() => { document.getElementById(`firstInput${that.codes.length - 1}`).focus(); }, 50);
        //         }


        //     }


        // });
    }


    open(paramContracts: any): Observable<any> {
        // this.modal.open();
        this.sms_params = paramContracts;
        this.services = paramContracts.service || '';
        this.headTitle = this.services === '' ? '更新数字证书信息' : '合同签署意愿性校验';
        this.phoneNumber = paramContracts.phone;
        delete this.sms_params.service;
        delete this.sms_params.phone;
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
        if (this.services === '') {
            this.xn.api.post2('/user/ca_verify_sms', { code: codeS }).subscribe(x => {
                if (x.ret === 0) {
                    this.close({ action: 'ok' });
                } else {
                    this.codeText = ['', '', '', '', '', ''];
                    this.xn.msgBox.open(false, x.msg);
                    this.isClick = false;
                }
            });
        } else if (this.sms_params.reSign !== undefined && this.sms_params?.reSign === true) {
            this.xn.api.dragon.post('/cfca/cfca_custom_sign', {
                smsCode: codeS,
                keyword: this.sms_params.keyword,
                fileId: this.sms_params.fileId,
                projectCode: this.sms_params.projectCode,
            }).subscribe(x => {
                if (x.ret === 0) {
                    this.close({ data: x.data, code: codeS });
                }

            })
        } else {
            const currentParams = Object.assign({}, this.sms_params, { smsCode: codeS });
            this.xn[this.services].post2('/cfca/check_sms_sign_contract', currentParams).subscribe(res => {
                if (res.ret === 0) {
                    this.close({ action: 'ok', contract: res.data.contract });
                } else {
                    this.isClick = false;
                    this.codeText = ['', '', '', '', '', ''];
                    this.xn.msgBox.open(false, res.msg);
                }
            });
        }

    }

    listenKeyUp(event, type) {
        if (type !== 5 && event.keyCode !== 8 && this.codeText[type] !== '') {
            window.setTimeout(() => { document.getElementById(`firstInput${type + 1}`).focus(); }, 50);
        }
        // $($('.my_input').get(type + 1)).blur();
        // $($('.my_input').get(type + 1)).focus();
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
