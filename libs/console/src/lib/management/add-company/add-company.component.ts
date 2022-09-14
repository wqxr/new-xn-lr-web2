import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { OnInit, ViewContainerRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzDemoModalBasicComponent } from 'libs/shared/src/lib/public/modal/cfca-result-modal.component';
@Component({
    templateUrl: './add-company.component.html',
    styles: [
        `
        label {
            font-weight: normal;
        }`,
        `.box-body {
            padding-bottom: 30px;
        }`,
        `.control-label {
            font-size: 12px;
            font-weight: bold
        }`,
        `.control-desc {
            font-size: 12px;
            padding-top: 7px;
            margin-bottom: 0;
            color: #999
        }`,
        `.xn-block {
            display: block
        }
        .helpUl li{
            text-align:left
        }
        .box-header {
            color: #444;
            display: block;
            padding: 10px;
            position: relative;
            padding-left: 10%;
        }
        .panel-heading {
            padding: 20px 15px;
            border-bottom: 1px solid transparent;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }
        `
        ,
    ]
})
export class AddCompanyComponent implements OnInit {

    step = 0;
    steped = 0;

    step1: any[];
    checkboxs: boolean[] = [false];

    step2: any[];
    step3: any[];

    adminRows: any[];
    caRows: any[];
    user1Rows: any[];
    user2Rows: any[];
    notifierRows: any[];
    public province: string = '';
    public city: string = '';
    public isLoading = false;

    // lastAdminRole: string = '';
    // isShowUser1: boolean = null; // 先要设置为null
    // isShowUser2: boolean = null; // 先要设置为null

    step4: any[];
    step5: any[];
    step1Form: FormGroup;
    step2Form: FormGroup;
    step3Form: FormGroup;
    checkReal: boolean;

    params: any = {};

    constructor(private xn: XnService, private vcr: ViewContainerRef, private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.buildForm1();
        this.buildForm2();
        this.buildForm3();
        this.step1Form.valueChanges.subscribe(x => {
            if (x !== '') {
                this.buildForm3();
            }
        });


    }
    private assign(stepRows) {
        for (let row of stepRows) {
            if (row.checkerId in this.params) {
                row.value = this.params[row.checkerId];
            }
        }
    }

    private buildChecker(stepRows) {
        for (let row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    private buildForm1() {
        this.step1 = [
            {
                title: '管理员姓名', checkerId: 'adminName', memo: '机构账户管理人',
                validators: {
                    cnName: true
                }
            },
            {
                title: '管理员身份证号', checkerId: 'adminCardNo',
                validators: {
                    cards: {
                        name: 'idCard'
                    }
                },
                placeholder: '请输入管理员身份证号',
            },
            {
                title: '管理员邮箱', checkerId: 'adminEmail',
                validators: {
                    email: true
                },
                memo: '用于接收电子发票，请准确填写'
            },
            {
                title: '管理员手机号码', checkerId: 'adminMobile', memo: '',
                validators: {
                    mobile: true
                }
            },
            // {
            //     title: '短信验证码', checkerId: 'code', type: 'sms',
            //     validators: {
            //         minlength: 6,
            //         maxlength: 6,
            //         number: true,
            //         sms: {
            //             name: 'adminMobile',
            //             error: '请先填写正确的管理员手机号码'
            //         }
            //     },
            //     options: {
            //         smsType: 1
            //     }
            // },
        ];
        XnFormUtils.buildSelectOptions(this.step1);
        this.assign(this.step1);
        this.buildChecker(this.step1);
        this.step1Form = XnFormUtils.buildFormGroup(this.step1);
    }

    private buildForm2() {
        this.step2 = [
            {
                title: '营业执照', checkerId: 'businessLicenseFile', type: 'newfile_upload',
                options: {
                    filename: '营业执照',
                    fileext: 'image/jpg,image/jpeg,image/png,application/pdf',
                    picSize: '5120',
                    multiple: false,
                }
            },
            {
                title: '企业名称', checkerId: 'orgName', options: { readonly: false }
            },
            {
                title: '统一社会信用代码', checkerId: 'orgCodeNo', options: { readonly: false }
            },
            {
                title: '法定代表人姓名', checkerId: 'orgLegalPerson', options: { readonly: false }
            },
            {
                title: '证件类型', checkerId: 'orgLegalPersonCardType', type: 'select', options: { ref: 'newcardType' }, value: '身份证'
            },
            {
                title: '证件号码', checkerId: 'orgLegalPersonCardNo',
                validators: {
                    card: {
                        name: 'orgLegalPersonCardType'
                    }
                }
            },
            {
                title: '实际经营地址', checkerId: 'orgAddress', options: { readonly: false }, placeholder: '请填写详细地址'
            },
        ];

        XnFormUtils.buildSelectOptions(this.step2);
        this.assign(this.step2);
        this.buildChecker(this.step2);
        this.step2Form = XnFormUtils.buildFormGroup(this.step2);
    }
    private buildForm3() {
        this.step3 = [
            {
                title: '授权确认函', checkerId: 'authConfirmationFile', type: 'down-upload',
                options: {
                    filename: '授权确认函',
                    fileext: 'pdf',
                    picSize: '300',
                    type: 3,
                    value: JSON.stringify(
                        {
                            adminUserName: this.step1Form.get('adminName').value,
                            adminIdCard: this.step1Form.get('adminCardNo').value,
                            adminPhone: this.step1Form.get('adminMobile').value,
                            adminEmail: this.step1Form.get('adminEmail').value,
                        })
                }
            },
        ]
        XnFormUtils.buildSelectOptions(this.step3);
        this.assign(this.step3);
        this.buildChecker(this.step3);
        this.step3Form = XnFormUtils.buildFormGroup(this.step3);
    }
    onFinish() {
        const params = Object.assign({ checkReal: this.checkReal }, this.step1Form.value, this.step2Form.value, this.step3Form.value);
        this.xn.api.post('/user/create_account', params).subscribe(x => {
            if (x.ret === 0) {
                let successinfo = {
                    title: '手动开户提示',
                    okButton: '确定',
                    cancelButton: null,
                    img: '/assets/lr/img/success.png',
                    info: '资料提交成功',
                    reason: '',
                    text: '',
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {
                    if (x && x.action === 'ok') {
                        window.history.back();
                    }

                });
            }

        });
    }
    onStepValid() {
        return this.step1Form.valid && this.step2Form.valid && this.step3Form.valid;

    }
    onCancel() {
        window.history.back();
    }
    getAdminInfo(event) {
        this.checkReal = event.target.checked;
    }
}
