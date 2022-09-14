/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\operator-info\operator-info.component.ts
 * @summary：经办人信息页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-27
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import {
  AccountStatusTypeEnum,
  AuditStatusEnum,
  InfoActiveEnum,
  PageTypeEnum,
  RecordTypeEnum,
  RetCodeEnum,
} from 'libs/shared/src/lib/config/enum';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormlyFieldUpload } from '@lr/ngx-formly';
import { FileInfo } from '@lr/ngx-shared';
import { FileViewerService } from '@lr/ngx-shared';
import {
  AuditIconColorOptions,
  AuditIconTypeOptions,
  AuditStatusOptions,
  CheckFlowOptions,
  CheckUrlOptions,
  InfoActiveOptions,
} from 'libs/shared/src/lib/config/options';
import { XnSelectOptionPipe } from '../../../shared/pipes';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { idCardCheckInfo } from '../../../shared/components/formly-form/idcard-upload/interface';
import { UPLOAD_IMAGE_REQUEST } from '../../../shared/constants';
import { MinUtils } from '../../../shared/utils';
import { ShowModalService } from '../../../shared/services/show-modal.service';
import { AccountEditModelParams, AuthorizeModalParams, EditModelSubmitParams } from '../../../shared/components/modal/interface';
import { XnProcessRecordModalComponent } from '../../../shared/components/modal/process-record.modal';
import { AccountAntEditModalComponent } from '../../../shared/components/modal/account-ant-edit-modal/account-ant-edit-modal.compoonent';
import { zip } from 'rxjs';
import { CheckRequestService } from '../../../shared/services/check-request.service';
import { CheckParams } from '../../../shared/interface';
import { XnUploadAuthorizeModalComponent } from '../../../shared/components/modal/upload-authorize-file.modal';

@Component({
  templateUrl: './operator-info.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-picker {
        width: 100%;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      .status-box {
        position: absolute;
        top: 15px;
        right: 110px;
      }
      .active-status {
        width: 60px;
        height: 30px;
        background: #d1e0f4;
        color: #407fd0;
        text-align: center;
        line-height: 30px;
        border-radius: 30px;
      }
      .record-link {
        position: absolute;
        top: 20px;
        right: 10px
      }
    `,
  ],
})
export class OperatorInfoComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  // 经办人信息
  operatorInfo: any = {} as any;
  loading: boolean = false;
  form = new FormGroup({});
  model: any = {} as any;
  pageType: PageTypeEnum;
  // 法人手机号
  corpMobile: string = '';
  options: FormlyFormOptions = {
    formState: {
      // 国籍options
      nationalOptions: [],
      frontFileList: [],
      backFileList: [],
      authorFileList: [],
      // 证件正面审核信息
      idFrontInfo: new idCardCheckInfo(),
      cropFrontDisabled: false,
      // 证件反面审核信息
      idBackInfo: new idCardCheckInfo(),
      // 授权书审核信息
      authorInfo: new idCardCheckInfo(),
      cropBackDisabled: false,
      // 上传文件配置
      nzShowUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
      }
    },
  };
  // 查看
  showFields: FormlyFieldConfig[] = [
    {
      wrappers: ['card'],
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '经办人信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'name',
          type: 'input',
          templateOptions: {
            label: '经办人姓名',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'idNo',
          type: 'input',
          templateOptions: {
            label: '经办人身份证号',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'mobile',
          type: 'input',
          templateOptions: {
            label: '经办人手机号',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'certificateLimitDate',
          type: 'long-date-picker',
          templateOptions: {
            label: '经办人证件到期日',
            nzFormat: 'yyyy-MM-dd',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
          },
          expressionProperties: {
            'templateOptions.nzDisabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'countryCode',
          type: 'select',
          templateOptions: {
            label: '经办人国籍',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
          },
          expressionProperties: {
            'templateOptions.options': 'formState.nationalOptions',
            'templateOptions.nzDisabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'authorizationKey',
          type: 'idcard-upload',
          templateOptions: {
            label: '授权书文件',
            labelSpan: 15,
            controlSpan: 22,
            required: false,
            nzDisabled: true,
            readonly: true,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.operatorInfo.authorizationFileName,
                  url: this.operatorInfo.authorizationKey,
                },
              ];
              this.fs.openModal({ files });
            },
            onPreview: (e: any, x: XnFormlyFieldUpload) => {
              MinUtils.jsonToHump(e.response.data);
              const file = e.response.data;
              this.fs.openModal({
                files: this.filterFileUrl(file),
              });
            },
          },
          expressionProperties: {
            'templateOptions.checkInfo': 'formState.authorInfo',
            'templateOptions.nzFileList': 'formState.authorFileList',
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'idFrontKey',
          type: 'idcard-upload',
          templateOptions: {
            label: '证件正面（如身份证国徽页）',
            labelSpan: 15,
            controlSpan: 22,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.operatorInfo.idFrontFileName,
                  url: this.operatorInfo.idFrontKey,
                },
              ];
              this.fs.openModal({ files });
            },
            required: true,
            ...UPLOAD_IMAGE_REQUEST,
            onPreview: (e: any, x: XnFormlyFieldUpload) => {
              MinUtils.jsonToHump(e.response.data);
              const file = e.response.data;
              this.fs.openModal({
                files: this.filterFileUrl(file),
              });
            },
          },
          expressionProperties: {
            'templateOptions.nzDisabled': 'formState.cropFrontDisabled',
            'templateOptions.nzFileList': 'formState.frontFileList',
            'templateOptions.readonly': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.checkInfo': 'formState.idFrontInfo',
            'templateOptions.nzShowUploadList': 'formState.nzShowUploadList',
          },
          hooks: {
            onInit: (field: any) => {
              field?.formControl?.valueChanges.subscribe((val: any) => {
                this.options.formState.cropFrontDisabled =
                  Array.isArray(val) && val.length > 0;
              });
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'idBackKey',
          type: 'idcard-upload',
          templateOptions: {
            label: '证件反面页（如身份证个人信息页）',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            required: true,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.operatorInfo.idBackFileName,
                  url: this.operatorInfo.idBackKey,
                },
              ];
              this.fs.openModal({ files });
            },
            ...UPLOAD_IMAGE_REQUEST,
            onPreview: (e: any, x: XnFormlyFieldUpload) => {
              MinUtils.jsonToHump(e.response.data);
              const file = e.response.data;
              this.fs.openModal({
                files: this.filterFileUrl(file),
              });
            },
          },
          expressionProperties: {
            'templateOptions.nzDisabled': 'formState.cropBackDisabled',
            'templateOptions.nzFileList': 'formState.backFileList',
            'templateOptions.readonly': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.checkInfo': 'formState.idBackInfo',
            'templateOptions.nzShowUploadList': 'formState.nzShowUploadList',
          },
          hooks: {
            onInit: (field: any) => {
              field?.formControl?.valueChanges.subscribe((val: any) => {
                this.options.formState.cropBackDisabled =
                  Array.isArray(val) && val.length > 0;
              });
            },
          },
        },
      ],
    },
  ];

  // 审核信息
  checkForm = new FormGroup({});
  checkModel = {} as any;
  // 法人信息
  bussinessInfo = {} as any;
  get PageType() {
    return PageTypeEnum;
  }

  // 信息激活状态
  get infoActiveOptions() {
    return InfoActiveOptions;
  }

  /** 操作记录类型 */
  get recordType() {
    return RecordTypeEnum.MODIFIY_OPERATOR;
  }
  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private fs: FileViewerService,
    private optionPipe: XnSelectOptionPipe,
    private $modal: NzModalService,
    private vcr: ViewContainerRef,
    private showModal: ShowModalService,
    private checkRequestService: CheckRequestService,
    private xnSelectOptionPipe: XnSelectOptionPipe,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.accountId = params.accountId;
      this.fetchPageData();
    });
    this.router.data.subscribe((data) => {
      this.pageType = data.pageType || PageTypeEnum.VIEW;
      this.options.formState.nzShowUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: this.pageType === PageTypeEnum.EDIT,
        showDownloadIcon: false,
      }
      /** 审核资料 */
      if (this.isCheckStatus()) {
        this.setCheckModel();
      }
    });
  }

  fetchPageData() {
    this.loading = false;
    this.xn.loading.open();
    zip(
      // 获取经办人信息
      this.xn.middle.post2('/account/info/operator', { accountId: this.accountId }),
      // 获取法人手机号
      this.xn.middle.post2('/account/info/business', { accountId: this.accountId }),
      // 获取国籍枚举
      this.xn.middle.post2('/bos/enum/country/list', {})
    ).subscribe({
      next: ([operatorRes, businessRes, nationalRes]) => {
        this.xn.loading.close();
        if (operatorRes.code === RetCodeEnum.OK) {
          this.loading = true;
          this.operatorInfo = operatorRes.data;
          this.filterModelData(XnUtils.deepClone(this.operatorInfo));
        }
        if (businessRes.code === RetCodeEnum.OK) {
          this.corpMobile = businessRes.data.corpMobile;
          this.bussinessInfo = businessRes.data;
        }
        if (nationalRes.code === RetCodeEnum.OK) {
          this.options.formState.nationalOptions = nationalRes.data.countryList.map(
            (t: any) => {
              return { label: t.countryName, value: t.twoLetterCode };
            }
          );
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.loading = false;
        this.xn.loading.close();
      }
    })
  }

  /**
   * 设置审核信息
   */
  setCheckModel() {
    const nowFlow = this.xnSelectOptionPipe.transform(this.pageType, CheckFlowOptions);
    this.checkModel = {
      nowFlow: nowFlow,
      checker: this.xn.user.userName,
    }
  }

  /**
   * 过滤要展示的表单值
   * @param operatorInfo
   */
  filterModelData(operatorInfo: any) {
    const {
      name,
      idNo,
      mobile,
      certificateLimitDate,
      countryCode,
      idFrontKey,
      idFrontFileName,
      idFrontStatus,
      idFrontRemark,
      idBackKey,
      idBackFileName,
      idBackStatus,
      idBackRemark,
      authorizationKey,
      authorizationFileName,
      authorizationStatus,
      authorizationRemark
    } = operatorInfo;
    if (this.pageType !== PageTypeEnum.EDIT) {
      this.getIdCardCheckInfo(
        'idFrontInfo',
        idFrontFileName,
        idFrontStatus,
        idFrontRemark
      );
      this.getIdCardCheckInfo(
        'idBackInfo',
        idBackFileName,
        idBackStatus,
        idBackRemark
      );
    } else {
      // 证件正面信息
      this.options.formState.frontFileList = MinUtils.filterViewFileList(idFrontFileName, idFrontKey);
      // 证件反面信息
      this.options.formState.backFileList = MinUtils.filterViewFileList(idBackFileName, idBackKey);
    };
    this.getIdCardCheckInfo(
      'authorInfo',
      authorizationFileName,
      authorizationStatus,
      authorizationRemark
    );
    // 授权书信息
    this.options.formState.authorFileList = MinUtils.filterViewFileList(authorizationFileName, authorizationKey);
    this.model = {
      name,
      idNo,
      mobile,
      certificateLimitDate: MinUtils.getDateTime(certificateLimitDate),
      countryCode,
      idFrontKey,
      idBackKey,
    };
  }

  /**
   * 证件审核信息处理
   * @param idCardType 证件信息类型
   * @param fileName 文件名
   * @param idCheckStatus 审核状态
   * @param remark 审核不通过原因
   */
  getIdCardCheckInfo(
    idCardType: string,
    fileName: string,
    idCheckStatus: string,
    remark: string
  ) {
    this.options.formState[`${idCardType}`] = {
      fileName: fileName,
      checkText: this.optionPipe.transform(idCheckStatus, AuditStatusOptions),
      iconType: this.optionPipe.transform(idCheckStatus, AuditIconTypeOptions),
      nzColor: this.optionPipe.transform(idCheckStatus, AuditIconColorOptions),
      showReason: idCheckStatus === AuditStatusEnum.AUDIT_FAILURE,
      checkReason: remark,
    };
    this.cdr.markForCheck();
  }

  /**
   * 提交
   */
  submitForm() {
    if (this.isNewOperatorInfo()) {
      // 当经办人的“姓名、手机号、身份证号”任一发生变更时，在“修改页面”点击提交时，需弹窗重新上传“授权书”。
      const {
        corpName,
        corpIdNo,
        corpMobile,
        identityNo
      } = this.bussinessInfo;
      const {
        name: operatorName,
        idNo: operatorIdNo,
        mobile: operatorMobile
      } = this.model;
      const params: AuthorizeModalParams = {
        tipText: '由于本次修改了授权人信息，请重新上传新的授权书。',
        params: {
          accountId: this.accountId,
          identityNo,
          operatorName,
          operatorIdNo,
          operatorMobile,
          corpName,
          corpIdNo,
          corpMobile
        }
      };
      // 提示上传授权书
      this.showModal.openModal(this.xn, this.vcr, XnUploadAuthorizeModalComponent, params)
        .subscribe((fileKey: string) => {
          if (fileKey) {
            const newInfo = this.filterFromValue();
            newInfo.authorizationKey = fileKey;
            this.doRequest(newInfo);
          }
        });
    } else {
      const newInfo = this.filterFromValue();
      this.doRequest(newInfo);
    }
  }

  /**
   * 是否修改了经办人信息
   * @returns
   */
  isNewOperatorInfo(): boolean {
    let { name: oldName, IdNo: oldIdNo, mobile: oldMobile } = this.operatorInfo;
    let { name: newName, IdNo: newIdNo, mobile: newMobile } = this.model;
    // 判断经办人的“姓名、手机号、身份证号”是否变更
    return (oldName !== newName) || (oldIdNo !== newIdNo) || (oldMobile !== newMobile);
  }

  /**
   * 提交信息过滤处理
   */
  filterFromValue() {
    const formValue = XnUtils.deepClone(this.model);
    formValue.accountId = this.accountId;
    for (const key in formValue) {
      switch (key) {
        // date
        case 'certificateLimitDate':
          formValue[key] = moment(formValue[key]).format('YYYYMMDD');
          break;
        // fileKey
        case 'idFrontKey':
        case 'idBackKey':
        case 'authorizationKey':
          formValue[key] = MinUtils.filterFileKey(formValue[key]);
          break;

        default:
          break;
      }
    }
    const params = { ...formValue };
    return params;
  }

  /**
   * 提交修改信息请求
   * @param params
   */
  doRequest(params: any) {
    this.xn.loading.open();
    this.xn.middle
      .post('/account/info/operator/edit', params)
      .subscribe((x) => {
        this.xn.loading.close();
        if (x.code === RetCodeEnum.OK) {
          this.message.success('修改信息提交成功，请耐心等待平台审核！');
          this.xn.router
            .navigate(['index'], {
              relativeTo: this.router.parent,
            })
            .then();
        }
      });
  }

  /**
   * 预览文件过滤
   * @param file
   * @returns
   */
  filterFileUrl(file: any): FileInfo[] {
    return [
      {
        name: file.fileName,
        url: `${file.fileKey}`,
      },
    ];
  }

  /**
   * 修改信息
   */
  editOperatorFrom() {
    // 账户状态
    const accountStatus = this.operatorInfo.accountStatus || '';
    if (
      [AccountStatusTypeEnum.ACCOUNT_OPENED,
      AccountStatusTypeEnum.OPERATOR_REJECT].includes(accountStatus)) {
      if (this.operatorInfo.isActivate === InfoActiveEnum.INACTIVATED) {
        this.$modal.warning(
          {
            nzTitle: '提示',
            nzContent: '经办人信息尚未激活,请点击去激活按钮完成激活经办人信息操作',
            nzOkText: '去激活',
            nzCancelText: '取消',
            nzOnOk: () => {
              this.xn.router
                .navigate(['active-operator', this.accountId], {
                  relativeTo: this.router.parent,
                })
                .then();
            },
            nzOnCancel: () => { }
          }
        )
      } else {
        this.xn.router.navigate(['operator-info/edit', this.accountId], {
          relativeTo: this.router.parent,
        }).then();
      }
    } else {
      this.message.warning('当前状态不允许修改信息！');
    }
  }

  /**
   * 发送经办人手机验证码
   * @param
   */
  sendOperatorMobileSms(originalMobile: string) {
    const newOperatorMobile = this.model.mobile;
    const params: AccountEditModelParams = {
      width: 700,
      title: '发送验证码',
      formModalFields: [
        {
          key: 'smsCode',
          type: 'input-code',
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: '经办人旧手机验证码',
            placeholder: '请输入',
            pattern: /^\d{6}$/,
            maxLength: 6,
            required: true,
            mobile: originalMobile,
            labelSpan: 8,
            controlSpan: 16,
          },
          validators: {
            code: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return /^\d{6}$/.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '验证码格式不正确',
            },
          },
        },
        {
          key: 'newSmsCode',
          type: 'input-code',
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: '经办人新手机验证码',
            placeholder: '请输入',
            pattern: /^\d{6}$/,
            maxLength: 6,
            required: true,
            mobile: newOperatorMobile,
            labelSpan: 8,
            controlSpan: 16,
          },
          validators: {
            code: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return /^\d{6}$/.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '验证码格式不正确',
            },
          },
        },
      ],
    }
    this.showModal
      .openModal(this.xn, this.vcr, AccountAntEditModalComponent, params)
      .subscribe((value: EditModelSubmitParams) => {
        if (value.action) {
          const { smsCode, newSmsCode } = value.params;
          this.confirmSubmit(smsCode, newSmsCode);
        }
      });
  }


  goBack() {
    window.history.go(-1);
  }

  /**
   * 查看流程记录
   */
  async viewRecord() {
    const params = await this.checkRequestService.viewRecord({ accountId: this.accountId, recordType: this.recordType });
    this.showModal
      .openModal(this.xn, this.vcr, XnProcessRecordModalComponent, params)
      .subscribe();
  }

  /**
   * 提交审核信息
   */
  submitCheckForm() {
    const { auditResult, remark } = this.checkForm.value;
    const postUrl = this.xnSelectOptionPipe.transform(this.pageType, CheckUrlOptions);
    const checkParams: CheckParams = {
      accountId: this.accountId,
      flowType: this.recordType,
      auditResult,
      remark,
      pageType: this.pageType,
      postUrl
    };
    this.checkRequestService.submitCheckForm(checkParams);
  }

  /**
   * 确认修改
   */
  confirmModifiyInfo() {
    // 修改是否需要验证码
    const { needSmsCode } = this.operatorInfo;
    if (needSmsCode) {
      // 修改了经办人手机号
      const { originalMobile } = this.operatorInfo; // 原手机号
      this.sendOperatorMobileSms(originalMobile);
    } else {
      this.confirmSubmit();
    }
  }

  /**
   * 提交确认修改请求
   * @param smsCode 旧经办人手机验证码
   * @param newSmsCode 新经办人手机验证码
   */
  confirmSubmit(smsCode?: string, newSmsCode?: string) {
    this.xn.loading.open();
    this.xn.middle.post2('/account/info/operator/comfirm', { accountId: this.accountId, smsCode, newSmsCode }).subscribe({
      next: (res: any) => {
        this.xn.loading.close();
        if (res.code === RetCodeEnum.OK) {
          if (res.data.isActivate === InfoActiveEnum.INACTIVATED) {
            this.$modal.warning(
              {
                nzTitle: '提示',
                nzContent: '提交成功,请点击去激活按钮完成激活经办人信息操作',
                nzOkText: '去激活',
                nzCancelText: '取消',
                nzOnOk: () => {
                  this.xn.router
                    .navigate(['active-operator', this.accountId], {
                      relativeTo: this.router.parent,
                    }).then();
                },
                nzOnCancel: () => {
                  this.xn.router
                    .navigate(['index'], {
                      relativeTo: this.router.parent,
                    }).then();
                }
              }
            )
          } else {
            this.message.success('提交成功！');
            this.goBack();
          }
        } else {
          if (smsCode) {
            // 修改了经办人手机号
            const { originalMobile } = this.operatorInfo; // 原手机号
            this.sendOperatorMobileSms(originalMobile);
          }
        }
      },
      error: () => {
        this.xn.loading.close();
      }
    })
  }

  /**
   * 审核状态
   * @returns
   */
  isCheckStatus() {
    return [PageTypeEnum.CHECK_AUDIT, PageTypeEnum.CHECK_REVIEW].includes(this.pageType);
  }

  /**
   * 取消修改
   */
  cancelModifiyInfo() {
    this.$modal.confirm({
      nzTitle: '提示',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzContent: '确定要取消修改信息吗？',
      nzOnOk: () => {
        this.xn.loading.open();
        this.xn.middle
          .post('/account/info/abort/edit', { accountId: this.accountId })
          .subscribe({
            next: (v) => {
              this.xn.loading.close();
              if (v.code === RetCodeEnum.OK) {
                this.message.success('取消修改成功');
                this.goBack();
              }
            },
            error: () => {
              this.xn.loading.close();
            }
          });
      },
      nzOnCancel: () => { },
    });
  }

  canCancelModify() {
    /** 审核退回或者待确认状态下可以取消修改 */
    return [
      AccountStatusTypeEnum.OPERATOR_CONFIRM,
      AccountStatusTypeEnum.OPERATOR_REJECT
    ].includes(this.operatorInfo.accountStatus) &&
      [PageTypeEnum.CONFIRM, PageTypeEnum.EDIT].includes(this.pageType);
  }
}
