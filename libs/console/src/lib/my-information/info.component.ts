/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：InfoComponent
 * @summary：企业资料修改
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          企业资料修改         2019-03-22
 * **********************************************************************
 */

import { OnInit, Component, ViewContainerRef } from '@angular/core';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { StorageService } from 'libs/shared/src/lib/services/storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditInfoModalComponent } from 'libs/shared/src/lib/public/component/edit-info-modal.component';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { forkJoin } from 'rxjs';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { ActivatedRoute } from '@angular/router';
import {
  EditModalComponent,
  EditParamInputModel,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { ChangeCfcaCompanyComponent } from 'libs/shared/src/lib/public/modal/change-companydetail-cfca.component';
import { CertInfoChangeModelComponent } from 'libs/shared/src/lib/public/modal/certInfo-change-model.component';
import { CfcaCodeModalComponent } from 'libs/shared/src/lib/public/modal/cfca-code-modal.component';
import { CancellationCompanyModalComponent } from 'libs/shared/src/lib/public/modal/cancellation-company-cfca-modal.component';
import { NzDemoModalBasicComponent } from 'libs/shared/src/lib/public/modal/cfca-result-modal.component';
import { CfcaCertFileUploadModalComponent } from 'libs/shared/src/lib/public/modal/cfca-certFileupload-modal.component';
import { FitproductSo, SoSupplierInfoFieldType, SoSupplierInfoPostType, SoSupplierInfoUrl } from 'libs/shared/src/lib/config/enum';
// import { DragonCfcaCustomModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/cfca-custom/dragon-cfca-custom-modal.component';

@Component({
  templateUrl: './info.component.html',
  styles: [
    `
      .table {
        font-size: 13px;
      }

      .btn-right {
        float: right;
      }

      .btn {
        padding: 4px 12px;
      }
    `,
  ],
})
export class InfoComponent implements OnInit {
  pageTitle = '企业资料';
  pageDesc = '';
  tableTitle = '企业资料';
  invoiceInfo = '开票信息';
  certTitle = '数字证书管理';
  notifier = '重要通知联系人';
  orgFile = '基础资料'; // 企业文件
  userInfoTitle = '用户信息';
  certifyFile = '资质文件';
  showEnterprise = true;
  appData: any = {} as any;
  invoiceData: any = {} as any;
  extendInfo: any = {} as any;
  certData: any = {} as any;
  notifierData: any = {} as any;
  orgFileData: any = {} as any;
  isAdministrator = false;
  isPlatform = false;
  appId = '';
  userName: string; // 当前用户名
  // accountId: string; // accountId -> 手机号
  userId: string; // 用户ID
  // cardType: string; // 证件类型
  // cardNo: string; // 证件号码
  // mobile: string; // 手机号码
  userList: any[];
  // roleList: any[]; // 当前角色权限列表
  // email: string; // 用户邮箱
  certParams: any = {
    certUserName: '',
    certUserMobile: '',
    certUserCardType: '',
    memo: '',
    code: '',
  };

  postApi = {
    notifier: '/custom/app_info/app_info/update_notifier',
    cert: '/custom/app_info/app_info/update_cert',
    app: '/custom/app_info/app_info/update_app',
    invoice: '/custom/app_info/app_info/update_invoice', // 更新接口
  };
  public orgTypeLists = SelectOptions.get('orgType');
  public taxingType = SelectOptions.get('companyInvoice');
  public certifyList = [];
  //产品信息data
  public productInfo: any[];
  //企业曾用名信息
  public originalNameList: any[];

  constructor(
    public xn: XnService,
    private vcr: ViewContainerRef,
    public route: ActivatedRoute,
    private session: StorageService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((x) => {
      this.appId = x.appId;
    });
    // this.isPlatform = this.xn.user.orgType === 99;
    if (this.appId === undefined) {
      this.xn.user.isAdmin
        ? (this.isAdministrator = true)
        : (this.isAdministrator = false);
      this.initData();
    } else {
      this.customerInitData();
    }
  }
  // 初始化获取数据
  private initData() {
    this.xn.loading.open();
    forkJoin(
      this.xn.api.post('/app_info/getapp', {}),
      this.xn.api.post('/app_info/get_tax_info', {}), // 获取开票信息
      this.xn.api.post('/cert_info/get_cert_info', {}),
      this.xn.api.post('/notifier_info/get_notifier_info', {}),
      this.xn.api.post('/custom/avenger/customer_manager/get_app_file', {
        appId: this.xn.user.appId || null,
      }), // 企业文件/准入资料
      this.xn.api.post('/jzn/product/get_app_product_list', {
        appId: this.xn.user.appId,
        systemType: this.xn.user.systemType,
      }), // 产品信息
      this.xn.dragon.post('/app/app_details_info', {
        appId: this.xn.user.appId,
      }), // 企业详情信息
      this.xn.dragon.post('/certify/certify_app_list', {})
    ).subscribe(
      ([app, taxInfo, cert, notifier, org, productInfo, detailsInfo, certifyList]) => {
        this.appData = app.data;
        this.extendInfo = JSON.parse(app.data.extendInfo);
        this.invoiceData = taxInfo.data;
        this.certData = cert.data;
        this.notifierData = notifier.data;
        this.orgFileData = this.formValue(org.data, 1);
        this.productInfo = productInfo.data;
        this.originalNameList = detailsInfo.data?.originalNameList || [];
        this.userList = detailsInfo.data?.userList || [];
        this.certifyList = certifyList.data;
        this.userName = this.session.getData('userName');
        this.userId = this.session.getData('userId');
        this.certifyList.forEach((x:any)=>{
          if(x.certify_indate - new Date().getTime()>=0){
            x.status='已生效';
          }else{
            x.status='已过期';
          }
        })
      },
      () => { },
      () => {
        this.userList.forEach((item) => {
          item.mobile = XnUtils.cyptPhone(item.mobile);
          item.roleList = item.userRoleList.map((i) => i.roleName);
        });
        this.xn.loading.close();
      }
    );
  }
  // ORG 机构数据
  private customerInitData() {
    this.xn.loading.open();
    this.xn.api
      .post('/custom/avenger/customer_manager/org_file', {
        appId: this.appId,
      })
      .subscribe(
        (data) => {
          this.appData = data.data.appInfo;
          this.extendInfo = JSON.parse(this.appData.extendInfo);
          this.certData = data.data.certInfo;
          this.notifierData = data.data.notifierInfo;
          this.orgFileData = this.formValue(data.data.fileInfo, 1);
        },
        () => {
          this.xn.loading.close();
        }
      );
  }
  customCfca() {
    const params = {
      title: '自定义上传文件盖章',
      checker: [
        {
          title: '合同',
          checkerId: 'contractUploads',
          type: 'dragonMfile',
          required: 1,
          value: '',
          options:
            '{"filename": "交易合同","fileext": "pdf", "picSize": "500"}',
        },
      ],
      buttons: ['取消', '确定'],
      size: 'sm',
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => { });
  }
  // 企业上传更新资质
  handleCertifyFileUpdate(){
    this.xn.router.navigate(
      [
        `/logan/record/new/`,
      ],
      {
        queryParams: {
          id: 'sub_debtUnit_upload_certify',
        },
      }
    );
  }

  /**
   * 更新企业文件
   */
  public handleOrgFileUpdate() {
    const params: EditParamInputModel = {
      title: '资料适用产品选择',
      checker: [
        {
          title: '适用产品',
          checkerId: 'fitProduct',
          type: 'linkage-select',
          options: {
            ref: ['1'].includes(String(this.xn.user.orgType))
              ? 'fitProduct_sh'
              : 'fitProduct_normal',
          },
          required: true,
          value: '',
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'sm',
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (!v) {
        return false;
      }
      const obj = XnUtils.parseObject(v.fitProduct, {});
      if (obj && obj.proxy.toString() === FitproductSo.Sh.toString()) {
        this.xn.router.navigate([`/bank-shanghai/record/new/`], {
          queryParams: {
            id: 'sub_sh_supplementaryinfo_input',
            relate: 'mainIds',
            relateValue: [],
          }
        });
      } else if (obj && obj.proxy.toString() === FitproductSo.So.toString()) {
        this.xn.router.navigate([`/oct-shanghai/record/new/`], {
          queryParams: {
            id: 'sub_so_supplementaryinfo_input',
            relate: 'mainIds',
            relateValue: [],
          }
        });
      } else {
        this.xn.router.navigate([`/console/record/new/supplier_upload_information`]);
      }
    });
  }

  /**
   * 查看企业准入资料-上海银行
   */
  public handleOrgFileView() {
    const params: EditParamInputModel = {
      title: '选择需要查看的产品',
      checker: [
        {
          title: '产品',
          checkerId: 'fitProduct',
          type: 'linkage-select',
          options: {
            ref: ['1'].includes(String(this.xn.user.orgType))
              ? 'fitProduct_sh'
              : 'fitProduct_normal',
          },
          required: true,
          value: '',
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'sm',
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      if (!v) {
        return false;
      }
      const obj = XnUtils.parseObject(v.fitProduct, {});
      let url: string = SoSupplierInfoUrl.Normal;
      let postType: string = [String(FitproductSo.So), String(FitproductSo.Sh)].includes(obj.proxy) ?
        SoSupplierInfoPostType.So : SoSupplierInfoPostType.Normal;
      let fieldType = [String(FitproductSo.So), String(FitproductSo.Sh)].includes(obj.proxy) ?
        SoSupplierInfoFieldType.So : SoSupplierInfoFieldType.Normal;
      if ([String(FitproductSo.So)].includes(obj.proxy)) {
        url = SoSupplierInfoUrl.So;
      } else if ([String(FitproductSo.Sh)].includes(obj.proxy)) {
        url = SoSupplierInfoUrl.Sh;
      }
      const param = { appId: this.xn.user.appId };
      this.xn[postType].post(url, param).subscribe((x: any) => {
        if (x && x.ret === 0 && x.data) {
          this.orgFileData = this.formValue(x.data, fieldType);
        }
      });
    });
  }

  getOrgFileShow(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.orgFileData, key);
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public viewFile(paramFile: any, type: string) {
    if (type === 'api') {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        FileViewModalComponent,
        paramFile
      ).subscribe();
    } else if (type === 'dragon') {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonMfilesViewModalComponent,
        [paramFile]
      ).subscribe();
    }
  }

  /**
   *  查看资料
   * @param item
   * @param type {notifier:'重要通知联系人',cert:'数字证书管理员',app:'企业资料'}
   */
  public onViewEdit(item: any, type: string) {
    if (type === 'invoice') {
      this.xn.api.post('/app_info/get_update_tax_info', {}).subscribe((x) => {
        const invoiceInfo = Object.assign({}, item, x.data);
        const params = this[`${type}ViewEdit`](invoiceInfo);
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          EditInfoModalComponent,
          params
        ).subscribe((v) => {
          if (v) {
            const postParams = {
              invoice: {
                orgTaxpayerId: v.orgTaxpayerId || '',
                taxBankName: v.taxBankName || '',
                taxBankAccount: v.taxBankAccount || '',
                taxAddress: v.taxAddress || '',
                taxTelephone: v.taxTelephone || '',
                receiver: v.receiver || '',
                receiverPhoneNum: v.receiverPhoneNum || '',
                taxingType: Number(v.taxingType),
                email: v.email || '',
              },
            };
            this.xn.api
              .post(this.postApi[type], postParams[type])
              .subscribe(() => {
                this.initData();
              });
          }
        });
      });
    } else if (type === 'cert') {
      if (!this.isAdministrator) {
        const successinfo = {
          title: '提示',
          okButton: '确定',
          cancelButton: null,
          img: '/assets/lr/img/fail.png',
          info: '',
          reason: '非管理员不能操作，请联系管理员',
          text: '',
        };
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          NzDemoModalBasicComponent,
          successinfo
        ).subscribe((v) => { });
        return;
      }
      if (this.appData.hasCfca) {
        if (item.changCaInfo) {
          // 说明平台拒绝过
          this.getWhile(item.changCaInfo);
        } else {
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            CertInfoChangeModelComponent,
            item
          ).subscribe((v) => {
            if (v && v.action === 'ok') {
              let phone = item.certUserMobile.substring(
                item.certUserMobile.length - 4
              );
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                CfcaCodeModalComponent,
                { type: 1, phone: phone }
              ).subscribe((x) => {
                if (x && x.action === 'ok') {
                  const params = this.newcertViewEdit();
                  XnModalUtils.openInViewContainer(
                    this.xn,
                    this.vcr,
                    EditInfoModalComponent,
                    params
                  ).subscribe((v) => {
                    if (v) {
                      this.xn.api
                        .post('/user/ca_update_pre', v)
                        .subscribe((x) => {
                          if (x.ret === 0) {
                            this.certParams.certUserName = v.userName;
                            this.certParams.certUserMobile = v.phone;
                            this.certParams.certUserCardNo = v.idCard;
                            this.certParams.code = v.code;
                            this.certParams.memo = '';
                            this.getWhile(this.certParams);
                          }
                        });
                    }
                  });
                }
              });
            } else if (v && v.action === 'no') {
              // 注销
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                CancellationCompanyModalComponent,
                { type: 1 }
              ).subscribe((v) => { });
            }
          });
        }
      } else {
        const params = this[`${type}ViewEdit`](item);
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          EditInfoModalComponent,
          params
        ).subscribe((v) => {
          if (v) {
            const postParams = {
              cert: {
                certUserName: v.userName || '',
                certUserMobile: v.mobile || '',
                certUserCardType: v.cardType || '',
                certUserCardNo: v.cardNo || '',
                certUserEmail: v.email || '',
              },
            };
            this.xn.api
              .post(this.postApi[type], postParams[type])
              .subscribe(() => {
                this.initData();
              });
          }
        });
      }
    } else {
      const params = this[`${type}ViewEdit`](item);
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditInfoModalComponent,
        params
      ).subscribe((v) => {
        if (v) {
          const postParams = {
            notifier: {
              notifierName: v.userName || '',
              notifierMobile: v.mobile || '',
              notifierCardType: v.cardType || '',
              notifierCardNo: v.cardNo || '',
              notifierEmail: v.email || '',
            },
            cert: {
              certUserName: v.userName || '',
              certUserMobile: v.mobile || '',
              certUserCardType: v.cardType || '',
              certUserCardNo: v.cardNo || '',
              certUserEmail: v.email || '',
            },
            app: {
              appName: v.appName || '',
              orgAddress: v.orgAddress || '',
              orgPostCode: v.orgPostCode || '',
            },
          };
          if (type === 'app') {
            if (v.appName !== item.appName && item.hasCfca) {
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                ChangeCfcaCompanyComponent,
                { type: 1 }
              ).subscribe((v) => {
                if (v && v.action === 'ok') {
                  const param = Object.assign({}, postParams[type], v.filelist);
                  this.xn.api.post(this.postApi[type], param).subscribe(() => {
                    this.xn.msgBox.open(false, '请等待cfca安心签的审核');
                    this.initData();
                  });
                }
              });
            } else {
              this.xn.api
                .post(this.postApi[type], postParams[type])
                .subscribe(() => {
                  this.initData();
                });
            }
          } else {
            this.xn.api
              .post(this.postApi[type], postParams[type])
              .subscribe(() => {
                this.initData();
              });
          }
        }
      });
    }
  }
  getWhile(changCaInfo: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      CfcaCertFileUploadModalComponent,
      changCaInfo
    ).subscribe((z) => {
      if (z && z.action === 'prev') {
        const params = this.newcertViewEdit(changCaInfo);
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          EditInfoModalComponent,
          params
        ).subscribe((v) => {
          if (v) {
            this.xn.api.post('/user/ca_update_pre', v).subscribe((x) => {
              if (x.ret === 0) {
                this.certParams.certUserName = v.userName;
                this.certParams.certUserMobile = v.phone;
                this.certParams.certUserCardNo = v.idCard;
                this.certParams.code = v.code;
                this.certParams.memo = changCaInfo.memo;
                this.getWhile(this.certParams);
              }
            });
          }
        });
      } else if (z) {
        let params = {
          userName: '',
          phone: '',
          idCard: '',
        };
        params.idCard = changCaInfo.certUserCardNo || changCaInfo.idCard;
        params.phone = changCaInfo.certUserMobile || changCaInfo.phone;
        params.userName = changCaInfo.certUserName || changCaInfo.userName;
        this.certParams = Object.assign({}, params, z);
        this.xn.api
          .postMap('/user/ca_update_info', this.certParams)
          .subscribe((x) => {
            if (x.ret === 0) {
              const successinfo = {
                title: '提示',
                okButton: '确定',
                cancelButton: null,
                img: '/assets/lr/img/success.png',
                info: '提交成功',
                reason: '',
                text: '平台审核时间为1-2个工作日',
              };
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                NzDemoModalBasicComponent,
                successinfo
              ).subscribe((x) => { });
            } else {
              const successinfo = {
                title: '提示',
                okButton: '确定',
                cancelButton: '取消',
                img: '',
                info: x.msg,
                reason: ``,
                text: '',
                alertimg: '/assets/lr/img/remind-orange.png',
              };
              XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                NzDemoModalBasicComponent,
                successinfo
              ).subscribe((x) => { });
            }
          });
      }
    });
  }

  /**
   * 重要通知联系人
   * @param item
   */
  private notifierViewEdit(item) {
    const params = {
      title: '更新重要通知联系人',
      size: ModalSize.Large,
      checker: [
        {
          checkerId: 'userName',
          required: true,
          type: 'text',
          title: '姓名',
          validators: {
            cnName: true,
          },
          value: item.notifierName,
        },
        {
          checkerId: 'mobile',
          required: true,
          type: 'text',
          title: '手机号',
          validators: {
            mobile: true,
          },
          value: item.notifierMobile,
        },
        {
          checkerId: 'cardType',
          required: true,
          type: 'select',
          title: '证件类型',
          options: { ref: 'cardType' },
          value: item.notifierCardType,
        },
        {
          checkerId: 'cardNo',
          required: true,
          type: 'text',
          title: '证件号码',
          validators: {
            card: {
              name: 'cardType',
            },
          },
          value: item.notifierCardNo,
        },
        {
          checkerId: 'email',
          required: true,
          type: 'text',
          title: '邮件',
          validators: {
            email: true,
          },
          value: item.notifierEmail,
        },
      ],
    };
    return params;
  }

  /**
   * 企业资料
   * @param item
   */
  private appViewEdit(item) {
    const params = {
      title: '更新企业资料',
      size: ModalSize.Large,
      options: { tips: '点击“确定”后将自动更新法人信息' },
      checker: [
        {
          checkerId: 'appName',
          required: true,
          type: 'text',
          title: '企业名称',
          validators: {
            cnName: true,
          },
          value: item.appName,
        },
        {
          checkerId: 'orgAddress',
          required: true,
          type: 'text',
          title: '联系地址',
          value: item.orgAddress,
        },
        {
          checkerId: 'orgPostCode',
          required: true,
          type: 'text',
          title: '邮政编码',
          validators: {
            zip: true,
          },
          value: this.extendInfo.orgPostCode,
        },
      ],
    };
    return params;
  }
  /**
   * 开票信息
   * @param item
   */
  private invoiceViewEdit(item) {
    const params = {
      title: '更新开票信息',
      size: ModalSize.Large,
      checker: [
        {
          title: '纳税识别号',
          checkerId: 'orgTaxpayerId',
          type: 'text',
          required: true,
          validators: {
            taxNumber: true,
          },
          value: item.orgTaxpayerId,
        },
        {
          title: '开户银行名称',
          checkerId: 'taxBankName',
          type: 'text',
          required: true,
          validators: {
            cnName: true,
          },
          value: item.taxBankName,
        },
        {
          title: '银行账号',
          checkerId: 'taxBankAccount',
          type: 'text',
          required: true,
          validators: {
            number: true,
          },
          value: item.taxBankAccount,
        },
        {
          title: '税务信息地址',
          checkerId: 'taxAddress',
          type: 'text',
          required: true,
          value: item.taxAddress,
        },
        {
          title: '税务信息电话 ',
          checkerId: 'taxTelephone',
          type: 'text',
          required: true,
          validators: {
            mobileTel: true,
          },
          value: item.taxTelephone,
        },
        {
          title: '收件人',
          checkerId: 'receiver',
          type: 'text',
          required: true,
          value: item.receiver,
        },
        {
          title: '收件人电话',
          checkerId: 'receiverPhoneNum',
          type: 'text',
          required: true,
          validators: {
            mobile: true,
          },
          value: item.receiverPhoneNum,
          memo: '收件人及收件人电话仅为了完善信息,开票过程不作使用,可填写系统管理员信息',
        },
        {
          checkerId: 'taxingType',
          required: true,
          type: 'radio',
          title: '开票类型',
          options: { ref: 'companyInvoice' },
          value: 1,
        },
        {
          title: '邮箱',
          checkerId: 'email',
          type: 'text',
          required: true,
          validators: {
            email: true,
          },
          value: item.email,
          memo: '接收发票的邮箱地址，务必准确填写',
        },
      ],
    };
    return params;
  }
  // 数字证书申请
  onchangeEdit(item) {
    if (!this.isAdministrator) {
      let successinfo = {
        title: '提示',
        okButton: '确定',
        cancelButton: null,
        img: '/assets/lr/img/fail.png',
        info: '',
        reason: '非管理员不能操作，请联系管理员',
        text: '',
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        NzDemoModalBasicComponent,
        successinfo
      ).subscribe((v) => { });
      return;
    }

    this.xn.api.post('/user/pre_three_verify', {}).subscribe((x) => {
      // 校验三要素， 通过才可发情证书申请
      if (x.ret === 0) {
        if (item.cfcaStatus === 0) {
          this.gotoStep(item);
        } else if (
          (item.cfcaStatus >= 2 && item.cfcaStatus <= 5) ||
          item.cfcaStatus === 10
        ) {
          this.xn.router.navigate(['/registry'], {
            queryParams: {
              step: item.cfcaStatus,
              orgApply: true,
              memo: item.memo ? item.memo : '',
            },
          });
        } else if (item.cfcaStatus === 9) {
          this.gotoStep(item);
        } else {
          const successinfo = {
            title: '提示',
            okButton: '确定',
            cancelButton: null,
            img: '/assets/lr/img/success.png',
            info: '',
            reason: '',
            text: '申请审核中,平台将在1-2个工作日内完成审核',
          };
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            NzDemoModalBasicComponent,
            successinfo
          ).subscribe((v) => { });
        }
      }
    });
  }

  gotoStep(item) {
    let steps = 2;
    // steps = 2;
    this.orgFileData.businessLicenseFile = !this.orgFileData.businessLicenseFile
      ? {}
      : this.orgFileData.businessLicenseFile;
    this.xn.router.navigate(['/registry'], {
      queryParams: { orgApply: true, step: steps },
    });
    const qParams = Object.assign(
      this.orgFileData.businessLicenseFile,
      this.appData,
      {
        step: steps,
        adminName: item.certUserName,
        adminEmail: item.certUserEmail,
        adminMobile: item.certUserMobile,
      }
    );
    this.session.saveData('cfcaInfo', qParams);
    // window.sessionStorage.setItem('cfcaInfo', JSON.stringify(qParams));
  }

  /**
   * 数字证书
   * @param item
   */
  private certViewEdit(item) {
    const params = {
      title: '更新数字证书管理员',
      size: ModalSize.Large,
      checker: [
        {
          checkerId: 'userName',
          required: true,
          type: 'text',
          title: '姓名',
          validators: {
            cnName: true,
          },
          value: item.certUserName,
        },
        {
          checkerId: 'mobile',
          required: true,
          type: 'text',
          title: '手机号',
          validators: {
            mobile: true,
          },
          value: item.certUserMobile,
        },
        {
          checkerId: 'cardType',
          required: true,
          type: 'select',
          title: '证件类型',
          options: { ref: 'cardType' },
          value: item.certUserCardType,
        },
        {
          checkerId: 'cardNo',
          required: true,
          type: 'text',
          title: '证件号码',
          validators: {
            card: {
              name: 'cardType',
            },
          },
          value: item.certUserCardNo,
        },
        {
          checkerId: 'email',
          required: true,
          type: 'text',
          title: '邮件',
          validators: {
            email: true,
          },
          value: item.certUserEmail,
        },
      ],
    };
    return params;
  }
  /**
   * 数字证书
   * @param item
   */
  private newcertViewEdit(item?) {
    const params = {
      title: '更新数字证书管理员',
      size: ModalSize.Large,
      checker: [
        {
          checkerId: 'userName',
          required: true,
          type: 'text',
          title: 'CA数字证书管理员姓名',
          validators: {
            cnName: true,
          },
          value: item ? item.certUserName : '',
        },
        {
          checkerId: 'idCard',
          required: true,
          type: 'text',
          title: 'CA数字证书管理员身份证号',
          validators: {
            cards: {
              name: 'idCard',
            },
          },
          value: item ? item.certUserCardNo : '',
        },
        {
          checkerId: 'phone',
          required: true,
          type: 'text',
          title: 'CA数字证书管理员手机号',
          validators: {
            mobile: true,
          },
          value: item ? item.certUserMobile : '',
        },
        {
          title: '短信验证码',
          checkerId: 'code',
          type: 'sms',
          validators: {
            minlength: 6,
            maxlength: 6,
            number: true,
            sms: {
              name: 'phone',
              error: '请先填写正确的管理员手机号码',
            },
          },
          options: {
            smsType: 1,
          },
        },
      ],
    };
    return params;
  }

  /**
   *  格式化特定数据json
   * @param paramInfo
   */
  private formValue(paramInfo: any, type: number) {
    const arr = !!type
      ? [
        'businessLicenseFile',
        'certUserAuthorize',
        'certUserCard',
        'orgLegalCard',
        'orgLegalCert',
        'companyDecision',
        'authorizationFile',
      ]
      : [
        'businessLicenseFile',
        'orgLegalCardFile',
        'orgLegalCertFile',
        'profitsRecognitionFile',
        'profitsCardFile',
        'companyDecisionFile',
        'authorizeLetterFile',
        'financeFile',
      ];
    arr.map((key) => (paramInfo[key] = JsonTransForm(paramInfo[key])));
    return paramInfo;
  }
}
