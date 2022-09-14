/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\supply-account-info\supply-account-info.component.ts
 * @summary：补充开户信息页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-29
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
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import {
  AuditIconColorOptions,
  AuditIconTypeOptions,
  AuditStatusOptions,
  CheckFlowOptions,
  CheckUrlOptions,
  CorpCardTypeOptions,
  EnterprisScaleOptions,
} from 'libs/shared/src/lib/config/options';
import { FileViewerService } from '@lr/ngx-shared';
import { ShowModalService } from '../../../shared/services/show-modal.service';
import { ProtocolFileViewerModal } from '../../../shared/components/modal/file-viewer.modal';
import {
  AccountApplyEnum,
  AuditStatusEnum,
  PageTypeEnum,
  RecordTypeEnum,
  RetCodeEnum
} from 'libs/shared/src/lib/config/enum';
import { XnFormlyFieldUpload } from '@lr/ngx-formly';
import { FileInfo } from '@lr/ngx-shared';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IDCardReg, MobileReg } from '../../../shared/validators/valid.regexp';
import { MinUtils } from '../../../shared/utils';
import { XnChoseFilmBankModalComponent } from '../../../shared/components/modal/chose-film-bank.modal';
import {
  AccountEditModelParams,
  AuthorizeModalParams,
  EditModelSubmitParams,
  FilmBankModalParams
} from '../../../shared/components/modal/interface';
import { UPLOAD_IMAGE_REQUEST } from '../../../shared/constants';
import { AccountAntEditModalComponent } from '../../../shared/components/modal/account-ant-edit-modal/account-ant-edit-modal.compoonent';
import { XnSelectOptionPipe } from '../../../shared/pipes';
import { CheckRequestService } from '../../../shared/services/check-request.service';
import { CheckParams } from '../../../shared/interface';
import { XnProcessRecordModalComponent } from '../../../shared/components/modal/process-record.modal';
import { XnUploadAuthorizeModalComponent } from '../../../shared/components/modal/upload-authorize-file.modal';
import { idCardCheckInfo } from '../../../shared/components/formly-form/idcard-upload/interface';

@Component({
  templateUrl: './supply-account-info.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-card {
        margin-bottom: 20px;
      }
      ::ng-deep .ant-picker {
        width: 100%;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      .add-account {
        text-align: right;
        position: absolute;
        bottom: 0;
        right: 70px;
      }
      .tip-account {
        position: absolute;
        bottom: 142px;
        left: 123px;
      }
      .select-account {
        position: absolute;
        bottom: 145px;
        right: 30px;
      }
      .record-link {
        position: absolute;
        top: 15px;
        right: 10px
      }
    `,
  ],
})
export class SupplyAccountInfoComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  loading: boolean = false;
  // 待开户信息
  operatorInfo: any = {} as any;
  form = new FormGroup({});
  model: any = {};
  // 同意协议
  checkRead: boolean = false;
  options: FormlyFormOptions = {
    formState: {
      // 国籍options
      nationalOptions: [],
      cropFrontDisabled: false,
      corpFrontFileList: [],
      cropBackDisabled: false,
      corpBackFileList: [],
      bussinessDisabled: false,
      bussinessFileList: [],
      operatorFrontDisabled: false,
      operatorFrontFileList: [],
      operatorBackDisabled: false,
      operatorBackFileList: [],
      authorFileList: [],
      // 授权书审核信息
      authorInfo: new idCardCheckInfo(),
      // 法人代表联系电话
      cropNoDisabled: false,
      // 验证码按钮禁用状态
      disabledCode: false,
      codeBtnText: '获取验证码',
      // 上传文件配置
      nzShowUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
      }
    },
  };
  // 开户表单信息
  showFields: FormlyFieldConfig[] = [
    {
      wrappers: ['card'],
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '企业信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'virAcctName',
          type: 'input',
          templateOptions: {
            label: '电子账本户名',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'identityNo',
          type: 'input',
          templateOptions: {
            label: '统一社会信用代码',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'enterprisScale',
          type: 'select',
          templateOptions: {
            label: '企业规模',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            options: EnterprisScaleOptions,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'businessLicenseKey',
          type: 'upload',
          templateOptions: {
            label: '营业执照',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
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
            'templateOptions.nzFileList': 'formState.bussinessFileList',
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.bussinessDisabled',
            'templateOptions.nzShowUploadList': 'formState.nzShowUploadList',
          },
          hooks: {
            onInit: (field: any) => {
              field?.formControl?.valueChanges.subscribe((val: any) => {
                this.options.formState.bussinessDisabled =
                  Array.isArray(val) && val.length > 0;
              });
            },
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
          },
          expressionProperties: {
            'templateOptions.checkInfo': 'formState.authorInfo',
            'templateOptions.nzFileList': 'formState.authorFileList',
          },
          hideExpression: () => {
            return !(this.isCheckStatus() || this.pageType === PageTypeEnum.CONFIRM);
          },
        },
      ],
    },
    {
      wrappers: ['card'],
      className: 'filed-card',
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '法人代表信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpName',
          type: 'input',
          templateOptions: {
            label: '法人代表姓名',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': 'formState.cropNoDisabled',
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpCardType',
          type: 'select',
          templateOptions: {
            label: '法人代表证件类型',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            disabled: true,
            labelSpan: 15,
            controlSpan: 22,
            options: CorpCardTypeOptions,
          },
          expressionProperties: {
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpIdNo',
          type: 'input',
          templateOptions: {
            label: '法人代表证件号',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': 'formState.cropNoDisabled',
            'templateOptions.required': () => true,
          },
          validators: {
            card: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return IDCardReg.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '请输入合法的身份证号码',
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpCertificateLimitDate',
          type: 'long-date-picker',
          templateOptions: {
            label: '法人代表证件到期日',
            nzFormat: 'yyyy-MM-dd',
            nzPlaceHolder: '请选择或输入日期如：2021-01-01',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpMobile',
          type: 'input',
          templateOptions: {
            label: '法人代表联系电话',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': 'formState.cropNoDisabled',
            'templateOptions.required': () => true,
          },
          validators: {
            phone: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return MobileReg.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '手机号不合规',
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpCountryCode',
          type: 'select',
          templateOptions: {
            label: '法人代表国籍',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.options': 'formState.nationalOptions',
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpIdFrontKey',
          type: 'upload',
          templateOptions: {
            label: '证件正面（如身份证国徽页）',
            labelSpan: 15,
            controlSpan: 22,
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
            'templateOptions.nzFileList': 'formState.corpFrontFileList',
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.cropFrontDisabled',
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
          key: 'corpIdBackKey',
          type: 'upload',
          templateOptions: {
            label: '证件反面（如身份证个人信息页）',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
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
            'templateOptions.nzFileList': 'formState.corpBackFileList',
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.cropBackDisabled',
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
          key: 'operatorName',
          type: 'input',
          templateOptions: {
            label: '经办人姓名',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorIdNo',
          type: 'input',
          templateOptions: {
            label: '经办人身份证号',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
          validators: {
            card: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return IDCardReg.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '请输入合法的身份证号码',
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorMobile',
          type: 'input',
          templateOptions: {
            label: '经办人手机号',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
          validators: {
            phone: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return MobileReg.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '手机号不合规',
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorCountryCode',
          type: 'select',
          templateOptions: {
            label: '经办人国籍',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.options': 'formState.nationalOptions',
          },
        },
        {
          className: 'ant-col ant-col-md-16 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorCertificateLimitDate',
          type: 'long-date-picker',
          templateOptions: {
            label: '经办人证件到期日',
            nzPlaceHolder: '请选择或输入日期如：2021-01-01',
            nzFormat: 'yyyy-MM-dd',
            labelSpan: 15,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorIdFrontKey',
          type: 'upload',
          templateOptions: {
            label: '证件正面（如身份证国徽页）',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
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
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.operatorFrontDisabled',
            'templateOptions.nzFileList': 'formState.operatorFrontFileList',
            'templateOptions.nzShowUploadList': 'formState.nzShowUploadList',
          },
          hooks: {
            onInit: (field: any) => {
              field?.formControl?.valueChanges.subscribe((val: any) => {
                this.options.formState.operatorFrontDisabled =
                  Array.isArray(val) && val.length > 0;
              });
            },
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'operatorIdBackKey',
          type: 'upload',
          templateOptions: {
            label: '证件反面（如身份证个人信息页）',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
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
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.operatorBackDisabled',
            'templateOptions.nzFileList': 'formState.operatorBackFileList',
            'templateOptions.nzShowUploadList': 'formState.nzShowUploadList',
          },
          hooks: {
            onInit: (field: any) => {
              field?.formControl?.valueChanges.subscribe((val: any) => {
                this.options.formState.operatorBackDisabled =
                  Array.isArray(val) && val.length > 0;
              });
            },
          },
        },
      ],
    },
    {
      wrappers: ['card'],
      className: 'filed-card',
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '银行账户信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'accountName',
          type: 'input',
          templateOptions: {
            label: '户名',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'acctBank',
          type: 'input',
          templateOptions: {
            label: '开户行名称',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'accountNo',
          type: 'input',
          templateOptions: {
            label: '账号',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
      ],
    },
  ];
  pageType: PageTypeEnum;

  // 审核信息
  checkForm = new FormGroup({});
  checkModel = {} as any;

  get PageType() {
    return PageTypeEnum
  }

  /** 操作记录类型 */
  get recordType() {
    return RecordTypeEnum.OPEN_ACCOUNT;
  }

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private fs: FileViewerService,
    private showModal: ShowModalService,
    private $modal: NzModalService,
    private xnSelectOptionPipe: XnSelectOptionPipe,
    private checkRequestService: CheckRequestService,
    private optionPipe: XnSelectOptionPipe,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.router.data.subscribe(params => {
      this.pageType = params.pageType || PageTypeEnum.VIEW;
      this.options.formState.nzShowUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: this.pageType === PageTypeEnum.EDIT,
        showDownloadIcon: false,
      }
    });
    this.router.params.subscribe((params) => {
      this.accountId = params?.accountId ? params.accountId : null;
      this.fetchNationalOptions();
      this.getAccountInfo();
    });
  }

  /**
   * 获取待开户信息
   */
  getAccountInfo() {
    this.loading = false;
    this.xn.loading.open();
    this.xn.middle
      .post2('/account/info', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.xn.loading.close();
          this.filterModelData(this.operatorInfo);
          if (x.code === RetCodeEnum.OK) {
            this.loading = true;
            this.operatorInfo = x.data;
            this.filterModelData(this.operatorInfo);
          }
        },
        () => {
          this.xn.loading.close();
        }
      );
  }

  /**
   * 过滤要展示的表单值
   * @param operatorInfo
   */
  filterModelData(operatorInfo: any) {
    const formValue = XnUtils.deepClone(operatorInfo);
    this.model = formValue;
    const {
      corpCertificateLimitDate,
      corpIdBackFileName,
      corpIdBackKey,
      corpIdFrontFileName,
      corpIdFrontKey,
      businessLicenseKey,
      businessLicenseFileName,
      operatorCertificateLimitDate,
      operatorIdFrontKey,
      operatorIdFrontFileName,
      operatorIdBackKey,
      operatorIdBackFileName,
      authorizationKey,
      authorizationFileName,
      authorizationStatus,
      authorizationRemark
    } = operatorInfo;
    // 二次开户

    // 法人证件正面信息
    this.options.formState.corpFrontFileList = MinUtils.filterViewFileList(corpIdFrontFileName, corpIdFrontKey);
    this.model.corpIdFrontKey = corpIdFrontKey ? this.options.formState.corpFrontFileList : '';
    // 法人证件反面信息
    this.options.formState.corpBackFileList = MinUtils.filterViewFileList(corpIdBackFileName, corpIdBackKey);
    this.model.corpIdBackKey = corpIdBackKey ? this.options.formState.corpBackFileList : '';
    // 法人代表证件到期日
    this.model.corpCertificateLimitDate = MinUtils.getDateTime(corpCertificateLimitDate);
    // 营业执照信息
    this.options.formState.bussinessFileList = MinUtils.filterViewFileList(businessLicenseFileName, businessLicenseKey);
    this.model.businessLicenseKey = businessLicenseKey ? this.options.formState.bussinessFileList : '';
    // 经办人证件正面信息
    this.options.formState.operatorFrontFileList = MinUtils.filterViewFileList(operatorIdFrontFileName, operatorIdFrontKey);
    this.model.operatorIdFrontKey = operatorIdFrontKey ? this.options.formState.operatorFrontFileList : '';
    // 经办人证件反面信息
    this.options.formState.operatorBackFileList = MinUtils.filterViewFileList(operatorIdBackFileName, operatorIdBackKey);
    this.model.operatorIdBackKey = operatorIdBackKey ? this.options.formState.operatorBackFileList : '';
    // 经办人代表证件到期日
    this.model.operatorCertificateLimitDate = MinUtils.getDateTime(operatorCertificateLimitDate);

    /** 审核资料/确认开户 */
    if (this.isCheckStatus() || this.pageType === PageTypeEnum.CONFIRM) {
      // 授权书文件审核信息
      this.getIdCardCheckInfo(
        'authorInfo',
        authorizationFileName,
        authorizationStatus,
        authorizationRemark
      );
      this.setCheckModel();
      this.checkRead = true;
    }
    /** 法人信息编辑状态 */
    this.options.formState.cropNoDisabled =
      this.operatorInfo.isFirst === AccountApplyEnum.NO_FIRST ||
      this.isCheckStatus() ||
      this.pageType === PageTypeEnum.CONFIRM;
    this.cdr.markForCheck();
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
   * 国籍枚举
   */
  fetchNationalOptions() {
    this.xn.middle.post('/bos/enum/country/list', {}).subscribe((x) => {
      if (x.code === RetCodeEnum.OK) {
        this.options.formState.nationalOptions = x.data.countryList.map(
          (t) => {
            return { label: t.countryName, value: t.twoLetterCode };
          }
        );
        this.cdr.markForCheck();
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
   * 取消开户
   */
  cancelApply() {
    this.$modal.confirm({
      nzTitle: '提示',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzContent: '确定要取消开户吗？',
      nzOnOk: () => {
        this.xn.middle
          .post('/account/cancel', { accountId: this.accountId })
          .subscribe((v) => {
            if (v.code === RetCodeEnum.OK) {
              this.message.success('取消开户成功');
              this.goBack();
            }
          });
      },
      nzOnCancel: () => { },
    });
  }

  /**
   * 阅读协议
   */
  viewFile() {
    this.showModal
      .openModal(this.xn, this.vcr, ProtocolFileViewerModal, {
        nzTitle: '查看协议',
        nzWidth: 1000,
        filesList: {
          files: [
            {
              name: '上海银行在线资金管理业务电子协议.pdf',
              url: this.accountId,
            },
          ],
        },
        options: {
          accountId: this.accountId,
          readonly: this.pageType !== PageTypeEnum.EDIT
        }
      })
      .subscribe((v) => {
        this.checkRead = this.pageType === PageTypeEnum.EDIT ? v.action : true;
        this.cdr.markForCheck();
      });
  }

  /**
   * 提交
   */
  submitForm() {
    const { accountId, identityNo } = this.operatorInfo;
    const {
      operatorName,
      operatorIdNo,
      operatorMobile,
      corpName,
      corpIdNo,
      corpMobile
    } = this.model;
    const params: AuthorizeModalParams = {
      tipText: '',
      params: {
        accountId,
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
      .subscribe((authorizationKey: string) => {
        if (authorizationKey) {
          this.firstBubmit(authorizationKey);
        }
      });
  }

  /**
   * 提交信息过滤处理
   * @param authorizationKey 授权书key
   */
  firstBubmit(authorizationKey: string) {
    const formValue = XnUtils.deepClone(this.model);
    delete formValue.isFirst;
    delete formValue.corpCountry;
    delete formValue.operatorCountry;
    delete formValue.corpIdBackFileName;
    delete formValue.corpIdFrontFileName;
    delete formValue.businessLicenseFileName;
    delete formValue.authorizationFileName;
    for (const key in formValue) {
      switch (key) {
        // date
        case 'corpCertificateLimitDate':
        case 'operatorCertificateLimitDate':
          formValue[key] = moment(formValue[key]).format('YYYYMMDD');
          break;
        // fileKey
        case 'corpIdFrontKey':
        case 'corpIdBackKey':
        case 'operatorIdFrontKey':
        case 'operatorIdBackKey':
        case 'businessLicenseKey':
          formValue[key] = MinUtils.filterFileKey(formValue[key]);
          break;

        default:
          break;
      }
    }
    const params = { ...formValue, authorizationKey };
    this.doRequest(params);
  }

  /**
   * 提交开户请求
   * @param params
   */
  doRequest(params: any) {
    this.xn.loading.open();
    this.xn.middle.post2('/account/submit', params).subscribe((x: any) => {
      this.xn.loading.close();
      if (x.code === RetCodeEnum.OK) {
        this.message.success('已提交至平台审核，请留意短信通知审核结果！');
        this.goBack();
      }
    });
  }

  /**
   * 发送法人手机验证码
   * @param
   */
  openCorpSmsModal() {
    const corpMobile = this.form.get('corpMobile').value;
    const params: AccountEditModelParams = {
      width: 600,
      title: '发送验证码',
      formModalFields: [
        {
          key: 'smsCode',
          type: 'input-code',
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: '法人手机验证码',
            placeholder: '请输入',
            pattern: /^\d{6}$/,
            maxLength: 6,
            required: true,
            mobile: corpMobile,
            labelSpan: 6,
            controlSpan: 18,
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
        const { smsCode } = value.params;
        this.activeAccuntInfo(smsCode);
      });
  }

  /**
   * activeAccuntInfo
   * @param
   */
  activeAccuntInfo(smsCode: string) {
    // 经办人信息
    const {
      operatorName,
      operatorIdNo,
      operatorMobile,
      corpCountryCode,
      operatorCountryCode
    } = this.model;
    const params = {
      accountId: this.accountId,
      smsCode,
      operatorName,
      operatorIdNo,
      operatorMobile,
      corpCountryCode,
      operatorCountryCode
    };
    this.xn.loading.open();
    // 修改未激活账户信息
    this.xn.middle.post2('/account/info/unactivate/edit', params).subscribe(v => {
      this.xn.loading.close();
      if (v.code === RetCodeEnum.OK) {
        this.message.success('提交成功！');
        this.xn.router
          .navigate(['active-account', this.accountId], {
            relativeTo: this.router.parent,
          }).then();
      } else {
        this.openCorpSmsModal();
      }
    })
  }

  /**
   * 选择银行账户信息
   */
  choseBankAccount(e: Event) {
    e.preventDefault();
    const accountNo = this.model.accountNo;
    const params: FilmBankModalParams = {
      appId: this.xn.user.appId,
      accountNo
    }
    this.showModal
      .openModal(this.xn, this.vcr, XnChoseFilmBankModalComponent, params)
      .subscribe((v: any) => {
        if (v) {
          const { acctBank, accountNo } = v;
          this.form.get('acctBank').setValue(acctBank);
          this.form.get('accountNo').setValue(accountNo);
        }
      });
  }

  /**
   * 没有选择银行账号
   */
  noAccountNo() {
    const accountNo = this.model.accountNo;
    return XnUtils.isEmptys(accountNo);
  }

  goBack() {
    window.history.go(-1);
  }

  /**
   * 查询操作记录
   */
  async viewRecord() {
    const params = await this.checkRequestService.viewRecord({ accountId: this.accountId, recordType: RecordTypeEnum.OPEN_ACCOUNT });
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
   * 确认开户
   */
  confirmOpenAccount() {
    const operatorMobile = this.form.get('operatorMobile').value;
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
            label: '经办人手机验证码',
            placeholder: '请输入',
            pattern: /^\d{6}$/,
            maxLength: 6,
            required: true,
            mobile: operatorMobile,
            labelSpan: 6,
            controlSpan: 18,
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
          const { smsCode } = value.params;
          this.submitConfirm(smsCode);
        }
      });
  }

  /**
   * 提交确认开户请求
   * @param smsCode
   */
  submitConfirm(smsCode: string) {
    this.xn.loading.open();
    this.xn.middle.post2('/account/confirm', { accountId: this.accountId, smsCode })
      .subscribe({
        next: (res: any) => {
          this.xn.loading.close();
          if (res.code === RetCodeEnum.OK) {
            if (this.operatorInfo.isFirst === AccountApplyEnum.NO_FIRST) {
              // 第二次开户
              this.openCorpSmsModal();
            } else {
              this.message.success('提交成功！');
              this.xn.router
                .navigate(['active-account', this.accountId], {
                  relativeTo: this.router.parent,
                }).then();
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
}

