import { Component, OnInit, ViewContainerRef, AfterViewInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzDemoModalBasicComponent } from 'libs/shared/src/lib/public/modal/cfca-result-modal.component';
import { ViewPdfModalComponent } from 'libs/shared/src/lib/public/modal/view-pdf.modal.component';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
@Component({
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.less']
})
export class RegistryComponent implements OnInit, AfterViewInit {
  style: any = {};
  step = 0;
  steped = 0;

  step1: any[];
  checkboxs: boolean[] = [false, false];

  step2: any[];

  adminRows: any[];
  caRows: any[];
  user1Rows: any[];
  user2Rows: any[];
  notifierRows: any[];
  public province: string = '';
  public city: string = '';
  public isLoading = false;
  public pageTitle = '用户注册';
  public rejectReason = '';
  public infomsg = "您关闭此页面后可通过“登录”回到当前注册步骤";
  // lastAdminRole: string = '';
  // isShowUser1: boolean = null; // 先要设置为null
  // isShowUser2: boolean = null; // 先要设置为null

  step4: any[];
  step5: any[];
  step6: any[];
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  step5Form: FormGroup;
  step6Form: FormGroup;
  private subject$: Subject<any>;
  cfcSecond: boolean = false;
  params: any = {};
  isRead: boolean[] = [false, false];
  cacheKey = '';

  constructor(private xn: XnService, private vcr: ViewContainerRef, private router: ActivatedRoute) {
  }

  ngOnInit() {
    // 判断是否有草稿
    this.router.queryParams.subscribe(x => {
      if (x && x.orgApply) {  // 存量用户补充资料
        this.cfcSecond = true;
        this.pageTitle = 'CFCA数字证书申请';
        this.infomsg = '您关闭此页面后可通过“企业资料-数字证书申请”回到当前步骤';
        if (Number(x.step) === 2) {
          const cfcaparams = JSON.parse(window.sessionStorage.getItem('cfcaInfo'));
          this.params.adminName = cfcaparams.adminName;
          this.params.adminEmail = cfcaparams.adminEmail;
          this.params.adminMobile = cfcaparams.adminMobile;
          this.step = Number(x.step);
          this.steped = Math.max(this.steped, this.step);
          // 重新创建表单
          this.buildForm2();
          this.step2Form.get('orgCodeNo').setValue(cfcaparams.orgCodeNo);
          this.step2Form.get('orgName').setValue(cfcaparams.appName);
        } else {
          if (Number(x.step) === 10) {
            this.step = 6;
            this.rejectReason = x.memo;
          } else {
            this.step = Number(x.step);
          }
          this.steped = Math.max(this.steped, this.step);
          // 重新创建表单
          this[`buildForm${this.step}`]();
        }
      } else if (x && x.step) {
        if (Number(x.step) === 10) {
          this.step = 6;
          this.rejectReason = x.memo;
        } else {
          this.step = Number(x.step);
        }
        this.cacheKey = x.cacheKey;
        this.steped = Math.max(this.steped, this.step);
        // 重新创建表单
        this[`buildForm${this.step}`]();
        this.isLoading = false;
      } else {
        this.step = 1;
        this.steped = 1;
        this.buildForm1();
      }
    });
  }
  ngAfterViewInit() {
    this.style = { background: 'url(assets/images/banner/banner-registry.png) center center no-repeat' };
  }
  getConfirmfile(fileName) { // 获取授权文件
    this.xn.api.post('/user/get_auth_confirm_file', { type: 'blank' }).subscribe(x => {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
        id: '',
        label: '',
        secret: '',
        readonly: true,
        data: x.data,
        fileName: fileName,
      }).subscribe(() => {
      });
    });
  }
  getRegisterFile() { // 查看注册指引
    this.xn.api.post('/user/get_protocol_file', { type: 'register' }).subscribe(x => {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
        id: '',
        label: '',
        secret: '',
        readonly: true,
        data: x.data,
        fileName: '平台注册操作指引',
      }).subscribe(() => {
      });
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
  temporySave() {
    if (this.cfcSecond) {
      this.xn.router.navigate(['/console/record/info']);
    } else {
      this.xn.router.navigate(['/login']);
    }
  }
  private buildForm1() {
    this.step1 = [
      {
        title: '管理员姓名', checkerId: 'adminName', memo: '',
        validators: {
          cnName: true
        }
      },
      {
        title: '管理员身份证号', checkerId: 'adminCardNo',
        validators: {
          cards: {
            name: 'adminCardNo'
          }
        }
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
          cfcaMobile: true
        }
      },
      {
        title: '短信验证码', checkerId: 'code', type: 'sms',
        validators: {
          minlength: 6,
          maxlength: 6,
          number: true,
          sms: {
            name: 'adminMobile',
            error: '请先填写正确的管理员手机号码'
          }
        },
        options: {
          smsType: 1
        }
      },
    ];
    XnFormUtils.buildSelectOptions(this.step1);
    this.assign(this.step1);
    this.buildChecker(this.step1);
    this.step1Form = XnFormUtils.buildFormGroup(this.step1);
  }

  private buildForm2() {
    this.step2 = [
      {
        title: '企业名称', checkerId: 'orgName', options: { readonly: false }, placeholder: '请填写与营业执照一致的企业名称'
      },
      {
        title: '统一社会信用代码', checkerId: 'orgCodeNo', options: { readonly: false }, placeholder: '请填写与营业执照一致的统一社会信用代码'
      },
      {
        title: '法定代表人姓名', checkerId: 'orgLegalPerson', options: { readonly: false }, memo: '分公司请填写分公司负责人信息'
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

    if (this.cfcSecond === true) {
      this.step2[0].options.readonly = true;
      this.step2[1].options.readonly = true;
      this.step2.pop();
    }
    XnFormUtils.buildSelectOptions(this.step2);
    this.assign(this.step2);
    this.buildChecker(this.step2);
    this.step2Form = XnFormUtils.buildFormGroup(this.step2);
  }

  private buildForm3() {
    this.adminRows = [
      {
        title: 'CA数字证书管理员姓名', checkerId: 'userName',
        validators: {
          cnName: true
        },
        placeholder: '请输入CA数字证书管理员姓名',

      },
      {
        title: 'CA数字证书管理员身份证号', checkerId: 'idCard',
        validators: {
          cards: {
            name: 'idCard'
          }
        },
        placeholder: '请输入CA数字证书管理员身份证号',
      },
      {
        title: 'CA数字证书管理员手机号', checkerId: 'phone', memo: '该手机号用于电子合同签署意愿性校验',
        validators: {
          cfcaMobile: true
        },
        placeholder: '请输入CA数字证书管理员手机号',

      },
      {
        title: '短信验证码', checkerId: 'code', type: 'sms',
        validators: {
          minlength: 6,
          maxlength: 6,
          number: true,
          sms: {
            name: 'phone',
            error: '请先填写正确的管理员手机号码'
          }
        },
        options: {
          smsType: 1
        },
        placeholder: '请输入短信验证码',

      }
    ];
    XnFormUtils.buildSelectOptions(this.adminRows);
    this.assign(this.adminRows);
    this.buildChecker(this.adminRows);
    this.step3Form = XnFormUtils.buildFormGroup(this.adminRows);
    this.step3Form.get('code').setValue('');
  }
  getAdminInfo(event) {
    if (event.target.checked) {
      this.xn.api.post('/user/ca_account_info', { cacheKey: this.cacheKey }).subscribe(x => {
        this.step3Form.get('userName').setValue(x.data.adminUserName);
        this.step3Form.get('idCard').setValue(x.data.adminCardNo);
        this.step3Form.get('phone').setValue(x.data.adminMobile);
      });

    } else {
      this.step3Form.get('userName').setValue('');
      this.step3Form.get('idCard').setValue('');
      this.step3Form.get('phone').setValue('');
    }
  }
  private buildForm4() {
    this.step4 = [
      {
        title: '开户名称', checkerId: 'orgName', options: { readonly: true }
      },
      {
        title: '开户银行', checkerId: 'bankInfo', type: 'select-search', options: { url: '/user/ca_bank_list', field: ['bankId', 'bankName', 'bankPayType'] }, memo: '您无需填写支行信息'
      },
      {
        title: '开户支行联行号', checkerId: 'bankName', type: 'select-search1',
        options: {
          showWhen: ['bankInfo', 2],
          url: '/user/bank_union_list',
          field: ['bankId', 'bankName'],
          placeholder: '可输入支行名称快速查询，若无请联系具体支行查询'
        }, memo: ''
      },
      {
        title: '银行账号', checkerId: 'bankAccount', options: { readonly: false }, validators: {
          maxlength: 32,
        },
      },
    ];



    XnFormUtils.buildSelectOptions(this.step4);
    this.assign(this.step4);
    this.buildChecker(this.step4);
    this.step4Form = XnFormUtils.buildFormGroup(this.step4);
    this.xn.api.post('/user/ca_account_info', { cacheKey: this.cacheKey }).subscribe(x => {
      if (x.ret === 0) {
        this.step4Form.get('orgName').setValue(x.data.orgName);
        this.step4Form.get('bankInfo').setValue(JSON.stringify({ value: x.data.bankId, text: x.data.bankName, bankPayType: x.data.bankPayType }));
        this.step4Form.get('bankAccount').setValue(x.data.bankAccount);
        this.step4Form.get('bankName').setValue(x.data.cnapsCode);

      }
    });
  }


  private buildForm5() {
    this.step5 = [
      {
        title: '开户名称', checkerId: 'orgName', options: { readonly: true }
      },
      {
        title: '开户银行', checkerId: 'bankName', options: { readonly: true }
      },
      {
        title: '银行账号', checkerId: 'bankAccount', options: { readonly: true }
      },
      {
        title: '收到金额', checkerId: 'amount', type: 'money', options: { readonly: false }, memo: '元'
      },
    ];

    XnFormUtils.buildSelectOptions(this.step5);
    this.assign(this.step5);
    this.buildChecker(this.step5);
    this.step5Form = XnFormUtils.buildFormGroup(this.step5);
    this.xn.api.post('/user/ca_account_info', { cacheKey: this.cacheKey }).subscribe(x => {
      if (x.ret === 0) {
        this.step5Form.get('orgName').setValue(x.data.orgName);
        this.step5Form.get('bankName').setValue(x.data.bankName);
        this.step5Form.get('bankAccount').setValue(x.data.bankAccount);
      }
    });
  }
  private buildForm6() {
    this.step6 = [
      {
        title: '营业执照', checkerId: 'businessLicenseFile', type: 'newfile_upload',
        options: {
          filename: '营业执照',
          fileext: 'image/jpg,image/jpeg,image/png,application/pdf',
          picSize: '5120',
          multiple: false,
        },
      },
      {
        title: '授权确认函', checkerId: 'authConfirmationFile', type: 'down-upload',
        options: {
          filename: '授权确认函',
          fileext: 'pdf',
          picSize: '300',
          type: 2,
          value: this.cacheKey,
        }
      },
      {
        title: '原件邮寄地址', checkerId: 'address', type: 'label',
        value: '深圳市福田区莲花街道海田路民生金融大厦14层深圳市链融科技股份有限公司，运行部授权函，0755-29966132', memo: '请使用顺丰或EMS邮寄'
      },
      {
        title: '快递单号', checkerId: 'expressNum', options: { readonly: false }, memo: '', placeholder: '请准确填写快递单号'
      },
    ];
    if (this.cfcSecond) {
      this.step6.shift();
    }
    XnFormUtils.buildSelectOptions(this.step6);
    this.assign(this.step6);
    this.buildChecker(this.step6);
    this.step6Form = XnFormUtils.buildFormGroup(this.step6);
  }
  cssClass(step): string {
    if (step === this.steped) {
      return 'current';
    }
    if (step > this.steped) {
      return 'disabled';
    } else {
      return 'success';
    }
  }

  onNext() {
    if (this.isLoading) {
      return;
    }
    const values = this[`step${this.step}Form`].value;
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        if (typeof (values[key]) === 'string') {
          this.params[key] = values[key].trim();
        } else {
          this.params[key] = values[key];

        }
      }
    }
    if (this.subject$) {
      this.subject$.unsubscribe();
    }
    this.subject$ = new Subject();
    this.subject$.subscribe(res => {
      try {
        if (res.ret === 0) {
          if (this.step === 1) {
            window.sessionStorage.setItem('readProtocolIds', res.data.readProtocolIds);
          } else if (this.step === 2) {
            this.cacheKey = res.data.cacheKey;
            // window.sessionStorage.setItem('cacheKey', res.data.cacheKey);
          }
          this.step = this.step + 1;
          this.steped = Math.max(this.steped, this.step);
          // 重新创建表单
          this[`buildForm${this.step}`]();
          this.isLoading = false;
        } else {
          const successinfo = {
            title: '提示',
            okButton: '确定',
            cancelButton: '取消',
            img: '',
            info: res.msg,
            reason: `请确认资料提交是否准确，请修正后重新提交`,
            text: '',
            alertimg: '/assets/lr/img/remind-orange.png'
          };
          XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {
          });
          this.isLoading = false;
        }
      } catch (error) {
      }
    });
    if (this.step === 1) {
      // this.step = this.step + 1;
      // this.steped = Math.max(this.steped, this.step);
      const threeInfo = {
        adminCardNo: values.adminCardNo,
        adminName: values.adminName,
        adminMobile: values.adminMobile,
      };
      // 重新创建表单
      // this[`buildForm${this.step}`]();
      this.isLoading = true;
      this.xn.api.postMap('/user/register_three_verify', threeInfo).subscribe(this.subject$); // 验证三要素
    } else if (this.step === 2) {
      this.isLoading = true;
      const cfcaSecond = {
        orgLegalPerson: values.orgLegalPerson,
        orgLegalPersonCardType: values.orgLegalPersonCardType,
        orgLegalPersonCardNo: values.orgLegalPersonCardNo,
        // businessLicenseFile: values.businessLicenseFile,
      };
      this.params.readProtocolIds = window.sessionStorage.getItem('readProtocolIds');
      if (this.cfcSecond) {
        this.xn.api.postMap('/user/pre_register_stock', cfcaSecond).subscribe(this.subject$);
      } else {
        this.xn.api.postMap('/user/pre_register', this.params).subscribe(this.subject$);
      }
    } else if (this.step === 3) {
      this.isLoading = true;
      values.cacheKey = this.cacheKey;
      this.xn.api.postMap('/user/ca_account_submit', values).subscribe(this.subject$);
    } else if (this.step === 4) {
      let params: any = {
      };
      this.isLoading = true;
      params.bankId = JSON.parse(values.bankInfo).value.toString();
      params.cnapsCode = values.bankName || '';
      params.bankAccount = values.bankAccount;
      params.cacheKey = this.cacheKey;
      this.xn.api.postMap('/user/ca_bank_submit', params).subscribe(this.subject$);

    } else if (this.step === 5) {
      let params: any = {
      };
      params.cacheKey = this.cacheKey;
      params.amount = XnUtils.accMul(Number(this.step5Form.get('amount').value), 100).toString();
      this.xn.api.post('/user/ca_verify_submit', params).subscribe(this.subject$);
    }

  }

  onPrev() {
    this.step = this.step - 1;
    // 重新创建表单
    this[`buildForm${this.step}`]();
  }

  onStep1Submit() {
    this.onNext();
  }

  onCheckBox(index, event) {
    this.onRead(index, event);
  }
  onDownload() {
    this.xn.api.getFileDownload('/user/get_auth_confirm_file',
      { cacheKey: this.cacheKey, type: 'applyCa', download: true }).subscribe(x => {
        const fileName = this.xn.api.getFileName(x._body.headers);
        this.xn.api.save(x._body.body, `${fileName}`);
      });
  }
  onRead(index, event?) {
    let urls, titles;
    switch (index) {
      case 1:
        titles = '链融平台参与方服务协议';
        break;
      case 2:
        titles = '链融平台隐私权政策协议';
        break;
    }
    this.xn.api.post('/user/get_protocol_file', { type: textTypeEnum[titles] }).subscribe(res => {
      if (res.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ViewPdfModalComponent,
          { titles: titles, data: res.data }).subscribe(x => {
            if (x && x.action === 'ok') {
              this.isRead[index - 1] = true;
              this.checkboxs[index - 1] = true;
              if (event) {
                event.target.checked = true;
              }
            } else {
              this.isRead[index - 1] = false;
              this.checkboxs[index - 1] = false;
              if (event) {
                event.target.checked = false;
              }

            }
          });
      }
    })

  }

  onStep1Valid() {
    return this.step1Form.valid && this.checkboxs.indexOf(false) < 0;
  }
  onStep2Valid() {
    return this.step2Form.valid;
  }
  onStep2SecondValid() {
    return this.step2Form.valid && this.checkboxs.indexOf(false) < 0;
  }
  onStep2Valid1() {
    return this.step2Form.valid;
  }

  onSubmit() {
    let successinfo = {
      title: '注册提示',
      okButton: '确定',
      cancelButton: null,
      img: '/assets/lr/img/success.png',
      info: '提交成功',
      reason: '',
      text: '平台审核时间为1-2个工作日，通过会有短信通知，即可登录平台',
    };
    if (this.cfcSecond) {
      successinfo.title = '提示';
    }
    const values = this.step6Form.value;
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        if (typeof (values[key]) === 'string') {
          this.params[key] = values[key].trim();
        } else {
          this.params[key] = values[key];

        }
      }
    }
    this.params.cacheKey = this.cacheKey;
    this.xn.api.post('/user/reg_upload_data_submit', this.params).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo)
          .subscribe(v => {
            if (this.cfcSecond) {
              this.xn.router.navigate(['/console/record/info']);
            } else {
              this.xn.router.navigate(['/login']);
            }
          });
      }
    });
  }
  onOk() {
    this.xn.router.navigate(['/console']);
  }
}
enum textTypeEnum {
  '链融平台参与方服务协议' = 'service',
  '链融平台隐私权政策协议' = 'privacy'
}
