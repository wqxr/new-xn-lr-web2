import {Component, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef} from '@angular/core';
import {ModalComponent} from '../../common/modal/components/modal';
import {Observable, of} from 'rxjs';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {XnService} from '../../services/xn.service';
import {PdfSignModalComponent} from './pdf-sign-modal.component';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';

@Component({
    templateUrl: './financing-factoring-modal.component.html',
    styles: [
            `.htmlDataRow {
            max-height: 450px;
            overflow: auto
        }`,
            `.flex {
            display: flex
        }`,
            `.title {
            margin-bottom: 20px;
        }`,
            `.xn-control-label {
            text-align: left;
            padding: 0;
            line-height: 34px;
        }`,
    ]
})
export class FinancingFactoringModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    params: any;
    flowId = '';
    showMain = false;
    showAttachment10 = false;
    isDisabled = true;
    checkboxs: boolean[] = [false, false];
    checkboxs1: boolean[] = [false, false, false];
    checkboxs2: boolean[] = [false, false, false, false];
    checkboxs3: boolean[] = [false, false, false, false, false];
    shows: any[] = [];
    hides: any[] = [];
    mainForm: FormGroup;
    userName = '';
    mobile = '';
    leader: any;
    formValid = false;

    private observer: any;
    private observable: any;

    constructor(private xn: XnService,
                private cdr: ChangeDetectorRef,
                private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.observable = Observable.create(observer => {
            this.observer = observer;
        });
    }

    open(params: any): Observable<string> {
        this.params = params;
        this.leader = this.params.leader;
        // this.userName = this.params.leader && this.params.leader.userName;
        // this.mobile = this.params.leader && this.params.leader.mobile;

        if (this.leader) {
            this.shows = [];
            this.hides = [];
            this.hides.push({
                name: 'mobile',
                required: true,
                // type: 'sms',
                title: '手机号码',
                value: this.leader.mobile,
            });
            this.shows.push({
                name: 'code',
                required: true,
                type: 'sms',
                title: '短信验证码',
                validators: {
                    minlength: 6,
                    maxlength: 6,
                    number: true,
                    sms: {
                        name: 'mobile',
                    }
                },
                options: {
                    smsType: 3,
                }
            });
            this.mainForm = XnFormUtils.buildFormGroup(this.shows, this.hides);
            this.mainForm.valueChanges.subscribe((v) => {
                this.formValid = this.mainForm.valid;
            });

            this.formValid = this.mainForm.valid;
        } else {
            this.formValid = true;
        }

        this.flowId = params.flowId; // 短一点
        this.showMain = !this.params.mainDone; // mainDone为true时表明主合同已经签过了
        this.showAttachment10 = Boolean(this.params.attachment10Id && this.params.attachment10Secret);

        this.cdr.markForCheck();

        if (params.size) {
            this.modal.open(params.size);
        } else {
            this.modal.open();
        }

        return this.observable;
    }

    private close(value: any) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    onOk() {
        // TODO 验证验证码

        if (!!this.leader) {
            this.xn.api.post('/limit_amount/validate_code', {
                code: this.mainForm.value.code,
                mobile: this.leader.mobile,
            }).subscribe(json => {
                if (json.ret === 0) {
                    this.xn.msgBox.open(false, '短信验证成功', () => {
                        this.close('ok');
                    });
                }
            });
        } else {
            this.close('ok');
        }
    }

    onView(index) {
        const param: any = {} as any;
        if (index === 1) {
            param.id = this.params.mainId;
            param.secret = this.params.mainSecret;
            param.config = {
                position: this.params.flowId === 'financing_supplier' || this.params.flowId === 'financing_supplier1' ||
                this.params.flowId === 'financing_supplier2'
                    ? '0,200,170,2' : '0,200,380,2'
            };
        } else if (index === 16 || index === 101) {  // 主合同同1
            param.id = this.params.mainId;
            param.secret = this.params.mainSecret;
            param.config = {
                position: this.params.flowId === 'financing_supplier3' || this.params.flowId === 'financing_supplier4'
                || this.params.flowId === 'financing_supplier5'
                    ? '0,200,170,2' : '0,200,380,2'
            };
        } else if (index === 2) {
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: this.params.flowId === 'financing_supplier' || this.params.flowId === 'financing_supplier1' ||
                this.params.flowId === 'financing_supplier2'
                    ? '甲方（电子签章、数字签名）' : '乙方（电子签章、数字签名）'
            };
        } else if (index === 3) {
            this.checkboxs[1] = true;
            param.id = this.params.attachment2Id;
            param.secret = this.params.attachment2Secret;
            param.config = {
                text: '乙方（电子签章、数字签名）'
            };
        } else if (index === 4) {
            if (!this.showAttachment10) {
                this.checkboxs[1] = true;
            }
            param.id = this.params.attachment3Id;
            param.secret = this.params.attachment3Secret;
            param.config = {
                text: '甲方（电子签章、数字签名）'
            };
        } else if (index === 5) {
            this.checkboxs[1] = true;
            param.id = this.params.notice2Id;
            param.secret = this.params.notice2Secret;
            param.config = {
                text: '保理商（电子签章、数字签名）'
            };
        } else if (index === 6) {
            this.checkboxs[1] = true;
            param.id = this.params.attachment5Id;
            param.secret = this.params.attachment5Secret;
            param.config = {
                text: '商票承兑人（电子签章、数字签名）'
            };
        } else if (index === 8) {
            param.id = this.params.attachment10Id;
            param.secret = this.params.attachment10Secret;
            param.config = {
                text: '（电子签章、数字签名）'
            };
        } else if (index === 10) {
            param.id = this.params.attachment10Id;
            param.secret = this.params.attachment10Secret;
            param.config = {
                text: this.params.flowId === 'financing_factoring1' ? '甲方(盖章)' : '乙方(盖章)'
            };
        } else if (index === 12 || index === 102) {
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: this.params.flowId === 'financing_factoring3' || this.params.flowId === 'financing_factoring4'
                || this.params.flowId === 'financing_factoring5'
                    ? '乙方（电子签章、数字签名）' : '甲方（电子签章、数字签名）'
            };
        } else if (index === 13) {
            this.checkboxs[1] = true;
            param.id = this.params.attachment2Id;
            param.secret = this.params.attachment2Secret;
            param.config = {
                text: this.params.flowId === 'factoring_loan3' || this.params.flowId === 'financing_factoring_two4'
                || this.params.flowId === 'financing_factoring_two5' ?
                    '乙方（电子签章、数字签名）' : '甲方（电子签章、数字签名）'
            };
        } else if (index === 14 || index === 103) {
            param.id = this.params.attachment3Id;
            param.secret = this.params.attachment3Secret;
            param.config = {
                text: this.params.flowId === 'financing_supplier3' || this.params.flowId === 'financing_supplier4'
                || this.params.flowId === 'financing_supplier5'
                    ? '甲方（电子签章、数字签名）' : '乙方（电子签章、数字签名）'
            };
        } else if (index === 15) {
            this.isDisabled = false;
            param.id = this.params.attachment10Id;
            param.secret = this.params.attachment10Secret;
            param.readonly = true;
        } else if (index === 20) {
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: '经授权的公司印章'
            };
        } else if (index === 21) {
            param.id = this.params.attachment2Id;
            param.secret = this.params.attachment2Secret;
            param.config = {
                text: '各执壹份'
            };
        } else if (index === 104) {
            param.id = this.params.attachment4Id;
            param.secret = this.params.attachment4Secret;
            param.config = {
                text: '销货方印章'
            };
        } else if (index === 105) {
            param.id = this.params.attachment5Id;
            param.secret = this.params.attachment5Secret;
            param.config = {
                text: '销货方印章'
            };
        } else if (index === 50) {
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: '（盖章）'
            };
        } else if (index === 51) {
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: '经授权的公司印章'
            };
        } else if (index === 52) {
            // debugger;
            param.id = this.params.attachment1Id;
            param.secret = this.params.attachment1Secret;
            param.config = {
                text: '经授权的公司印章'
            };
        } else if (index === 53) {
            param.id = this.params.attachment12Id;
            param.secret = this.params.attachment12Secret;
            param.config = {
                text: '甲方(盖章)'
            };
        } else if (index === 54) {
            param.id = this.params.attachment12Id;
            param.secret = this.params.attachment12Secret;
            param.config = {
                text: '乙方(盖章)'
            };
        }

        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, param).subscribe(v => {
            if (v.action === 'ok') {
                if (index === 2 || index === 1) {
                    if (!this.showMain) {
                        this.checkboxs[0] = true;
                    }
                    this.checkboxs[index - 1] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 4 || index === 8) {
                    if (!this.showAttachment10) {
                        this.checkboxs[0] = true;
                        this.checkboxs[1] = true;
                    } else {
                        this.checkboxs[index === 4 ? 0 : 1] = true;
                    }

                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 10) {
                    this.checkboxs[2] = true;
                } else if (index === 12) {
                    if (!this.showMain) {
                        this.checkboxs1[0] = true;
                    }
                    this.checkboxs1[1] = true;
                    this.isDisabled = this.checkboxs1.indexOf(false) >= 0;
                } else if (index === 13) {
                    this.checkboxs[0] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 14) {
                    if (!this.showMain) {
                        this.checkboxs1[0] = true;
                    }
                    this.checkboxs1[2] = true;
                    this.isDisabled = this.checkboxs1.indexOf(false) >= 0;
                } else if (index === 15) {
                    this.isDisabled = false;
                } else if (index === 16) {
                    if (!this.showMain) {
                        this.checkboxs1[0] = true;
                    }
                    this.checkboxs1[0] = true;
                    this.isDisabled = this.checkboxs1.indexOf(false) >= 0;
                } else if (index === 20) {
                    this.checkboxs[0] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 21) {
                    this.checkboxs[1] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 101 || index === 102 || index === 103 || index === 104 || index === 105) {
                    if (!this.showMain) {
                        this.checkboxs3[0] = true;
                    }
                    this.checkboxs3[index - 101] = true;
                    this.isDisabled = this.checkboxs3.indexOf(false) >= 0;
                } else if (index === 50) {
                    this.checkboxs[0] = true;
                    this.checkboxs[1] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 51) {
                    this.checkboxs[0] = true;
                    this.checkboxs[1] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else if (index === 52) {
                    this.checkboxs[0] = true;
                    this.checkboxs[1] = true;
                    this.isDisabled = this.checkboxs.indexOf(false) >= 0;
                } else {
                    this.checkboxs[0] = true;
                    this.isDisabled = false;
                }
            }
        });
    }
}
