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
  DepositHumanOptions,
  EnterprisScaleOptions,
  InfoActiveOptions,
  RegisteredTypeOptions
} from 'libs/shared/src/lib/config/options';
import {
  AccountStatusTypeEnum,
  AreaLevelEnum,
  AuditStatusEnum,
  InfoActiveEnum,
  PageTypeEnum,
  RecordTypeEnum,
  RetCodeEnum
} from 'libs/shared/src/lib/config/enum';
import { FileViewerService } from '@lr/ngx-shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { XnSelectOptionPipe } from '../../../shared/pipes';
import { idCardCheckInfo } from '../../../shared/components/formly-form/idcard-upload/interface';
import { XnFormlyFieldUpload } from '@lr/ngx-formly';
import { FileInfo } from '@lr/ngx-shared';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import * as moment from 'moment';
import { UPLOAD_IMAGE_REQUEST } from '../../../shared/constants';
import { MinUtils } from '../../../shared/utils';
import { IndustryService } from '../../../shared/services/industry.service';
import {
  AccountEditModelParams,
  AuthorizeModalParams,
  EditModelSubmitParams,
} from '../../../shared/components/modal/interface';
import { ShowModalService } from '../../../shared/services/show-modal.service';
import { AccountAntEditModalComponent } from '../../../shared/components/modal/account-ant-edit-modal/account-ant-edit-modal.compoonent';
import { zip } from 'rxjs';
import { CheckParams } from '../../../shared/interface';
import { CheckRequestService } from '../../../shared/services/check-request.service';
import { XnProcessRecordModalComponent } from '../../../shared/components/modal/process-record.modal';
import { XnUploadAuthorizeModalComponent } from '../../../shared/components/modal/upload-authorize-file.modal';

@Component({
  templateUrl: './business-info.component.html',
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
export class BusinessInfoComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  loading: boolean = false;
  // 工商信息
  bussinessInfo: any = {} as any;
  form = new FormGroup({});
  model: any = {} as any;
  options: FormlyFormOptions = {
    formState: {
      // 国籍options
      nationalOptions: [],
      // 客户类别options
      custTypeOptions: [],
      // 证件正面审核信息
      idFrontInfo: new idCardCheckInfo(),
      // 证件反面审核信息
      idBackInfo: new idCardCheckInfo(),
      // 营业执照审核信息
      businessInfo: new idCardCheckInfo(),
      // 授权书审核信息
      authorInfo: new idCardCheckInfo(),
      frontFileList: [],
      backFileList: [],
      bussinessFileList: [],
      authorFileList: [],
      cropFrontDisabled: false,
      cropBackDisabled: false,
      bussinessDisabled: false,
      // 上传文件配置
      nzShowUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
      }
    },
  };
  pageType: PageTypeEnum;

  showFields: FormlyFieldConfig[] = [
    {
      wrappers: ['card'],
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '账户信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'uuid',
          type: 'input',
          templateOptions: {
            label: '开户UUID',
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
          key: 'virAcctNo',
          type: 'input',
          templateOptions: {
            label: '企业电子账本',
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
          key: 'depositHuman',
          type: 'select',
          templateOptions: {
            label: '存款人类别',
            labelSpan: 15,
            controlSpan: 22,
            options: DepositHumanOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'companyDesc',
          type: 'input',
          templateOptions: {
            label: '英文客户全称（英文企业全称）',
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
          key: 'virAcctName',
          type: 'input',
          templateOptions: {
            label: '企业电子账本户名',
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
                  name: this.bussinessInfo.authorizationFileName,
                  url: this.bussinessInfo.authorizationKey,
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
      ]
    },
    {
      wrappers: ['card'],
      className: 'filed-card',
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '法人代表信息'
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
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
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
            options: CorpCardTypeOptions
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
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'corpCertificateLimitDate',
          type: 'date-picker',
          templateOptions: {
            label: '法人代表证件到期日',
            nzFormat: 'yyyyMMdd',
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
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
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
          type: 'idcard-upload',
          templateOptions: {
            label: '证件正面（如身份证国徽页）',
            labelSpan: 15,
            controlSpan: 22,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.bussinessInfo.corpIdFrontFileName,
                  url: this.bussinessInfo.corpIdFrontKey,
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
            'templateOptions.nzFileList': 'formState.frontFileList',
            'templateOptions.readonly': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.cropFrontDisabled',
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
          key: 'corpIdBackKey',
          type: 'idcard-upload',
          templateOptions: {
            label: '证件反面（如身份证个人信息页）',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.bussinessInfo.corpIdBackFileName,
                  url: this.bussinessInfo.corpIdBackKey,
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
            'templateOptions.nzFileList': 'formState.backFileList',
            'templateOptions.readonly': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.cropBackDisabled',
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
      ]
    },
    {
      wrappers: ['card'],
      className: 'filed-card',
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '工商信息'
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'identityNo',
          type: 'input',
          templateOptions: {
            label: '统一社会信用代码',
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
          key: 'registeredNumber',
          type: 'input',
          templateOptions: {
            label: '注册登记号',
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
          key: 'expirationDate',
          type: 'date-picker',
          templateOptions: {
            label: '注册期限',
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
          key: 'custIdTypeCode',
          type: 'select',
          templateOptions: {
            label: '客户类别',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.options': 'formState.custTypeOptions',
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
            labelSpan: 15,
            controlSpan: 22,
            options: EnterprisScaleOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'workAddPhone',
          type: 'input',
          templateOptions: {
            label: '办公地固定电话',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => false,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'registeredType',
          type: 'select',
          templateOptions: {
            label: '注册类型',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
            options: RegisteredTypeOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'registeredCapital',
          type: 'input',
          templateOptions: {
            label: '注册资本（元）',
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
          key: 'registeredAddPhone',
          type: 'input',
          templateOptions: {
            label: '注册地址电话号码',
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
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'industryCode',
          type: 'cascader-input',
          templateOptions: {
            label: '行业',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
            loadData: (node: NzCascaderOption, index: number) => {
              return this.$industry.loadIndustryData(node, index)
            }
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'workAddress',
          type: 'input',
          templateOptions: {
            label: '办公地址',
            placeholder: '请输入',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.disabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => false,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'registeredAddress',
          type: 'select-address-field',
          templateOptions: {
            label: '注册地址（具体到门牌号）',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 22,
          },
          expressionProperties: {
            'templateOptions.nzDisabled': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'scopeOfBus',
          type: 'textarea',
          templateOptions: {
            label: '企业经营范围',
            nzPlaceHolder: '请输入',
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
          key: 'businessLicenseKey',
          type: 'idcard-upload',
          templateOptions: {
            label: '营业执照',
            autocomplete: 'off',
            labelSpan: 15,
            controlSpan: 22,
            onPreviewFile: () => {
              const files = [
                {
                  name: this.bussinessInfo.businessLicenseFileName,
                  url: this.bussinessInfo.businessLicenseKey,
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
            'templateOptions.nzFileList': 'formState.bussinessFileList',
            'templateOptions.readonly': () => ![PageTypeEnum.EDIT].includes(this.pageType),
            'templateOptions.required': () => true,
            'templateOptions.nzDisabled': 'formState.bussinessDisabled',
            'templateOptions.checkInfo': 'formState.businessInfo',
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
      ]
    },
  ]

  // 选择绑定银行账号
  showBankModal: boolean = false;

  // 审核信息
  checkForm = new FormGroup({});
  checkModel = {} as any;
  // 经办人信息
  operatorInfo = {} as any;

  get PageType() {
    return PageTypeEnum;
  }

  // 信息激活状态
  get infoActiveOptions() {
    return InfoActiveOptions;
  }

  /** 操作记录类型 */
  get recordType() {
    return RecordTypeEnum.MODIFIY_BUSINESS;
  }

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private fs: FileViewerService,
    private $modal: NzModalService,
    private optionPipe: XnSelectOptionPipe,
    private $industry: IndustryService,
    private vcr: ViewContainerRef,
    private showModal: ShowModalService,
    private checkRequestService: CheckRequestService,
    private xnSelectOptionPipe: XnSelectOptionPipe,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
    this.router.data.subscribe(params => {
      this.pageType = params.pageType || PageTypeEnum.VIEW;
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
    this.router.params.subscribe(params => {
      this.accountId = params.accountId || null;
      this.getBussinessInfo();
      this.fetchOptions();
    });
  }

  /**
   * 获取工商信息
   */
  getBussinessInfo() {
    this.loading = false;
    this.xn.loading.open();
    this.xn.middle
      .post2('/account/info/business', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.xn.loading.close();
          if (x.code === RetCodeEnum.OK) {
            this.loading = true;
            this.bussinessInfo = x.data;
            this.filterModelData(this.bussinessInfo);
          }
        },
        () => {
          this.xn.loading.close();
        }
      );
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
   * 获取枚举值
   */
  fetchOptions() {
    zip(
      // 获取国籍枚举
      this.xn.middle.post('/bos/enum/country/list', {}),
      // 查询客户类别枚举
      this.xn.middle.post('/bos/enum/customer/list', {}),
      // 获取经办人信息
      this.xn.middle.post2('/account/info/operator', { accountId: this.accountId }),
    ).subscribe({
      next: ([nationalRes, custTypeRes, operatorRes]) => {
        this.options.formState.nationalOptions = nationalRes.data.countryList.map((t: any) => {
          return { label: t.countryName, value: t.twoLetterCode };
        });
        this.options.formState.custTypeOptions = custTypeRes.data.customerList.map((t: any) => {
          return { label: t.customerType, value: t.customerCode };
        });
        this.operatorInfo = operatorRes.data;
        this.cdr.markForCheck();
      }
    })
  }

  /**
   * 过滤要展示的表单值
   * @param bussinessInfo
   */
  filterModelData(bussinessInfo: any) {
    const {
      corpCertificateLimitDate,
      corpIdFrontKey,
      corpIdFrontFileName,
      corpIdFrontRemark,
      corpIdFrontStatus,
      corpIdBackKey,
      corpIdBackFileName,
      corpIdBackStatus,
      corpIdBackRemark,
      businessLicenseKey,
      businessLicenseFileName,
      businessLicenseStatus,
      businessLicenseRemark,
      industryLevelOneCode,
      industryLevelTwoCode,
      industryLevelThreeCode,
      industryLevelFourCode,
      authorizationKey,
      authorizationFileName,
      authorizationStatus,
      authorizationRemark
    } = bussinessInfo;

    if (this.pageType !== PageTypeEnum.EDIT) {
      this.options.formState.idFrontInfo = this.getIdCardCheckInfo(
        corpIdFrontFileName,
        corpIdFrontStatus,
        corpIdFrontRemark
      );
      this.options.formState.idBackInfo = this.getIdCardCheckInfo(
        corpIdBackFileName,
        corpIdBackStatus,
        corpIdBackRemark
      );
      this.options.formState.businessInfo = this.getIdCardCheckInfo(
        businessLicenseFileName,
        businessLicenseStatus,
        businessLicenseRemark
      );
    } else {
      // 证件正面信息
      this.options.formState.frontFileList = MinUtils.filterViewFileList(corpIdFrontFileName, corpIdFrontKey);
      // 证件反面信息
      this.options.formState.backFileList = MinUtils.filterViewFileList(corpIdBackFileName, corpIdBackKey);
      // 营业执照信息
      this.options.formState.bussinessFileList = MinUtils.filterViewFileList(businessLicenseFileName, businessLicenseKey);
    }
    this.options.formState.authorInfo = this.getIdCardCheckInfo(
      authorizationFileName,
      authorizationStatus,
      authorizationRemark
    );
    // 授权书信息
    this.options.formState.authorFileList = MinUtils.filterViewFileList(authorizationFileName, authorizationKey);
    const formValue = XnUtils.deepClone(bussinessInfo);
    delete formValue.registeredAddress
    this.model = formValue;
    // 行业
    this.model.industryCode = [
      industryLevelOneCode,
      industryLevelTwoCode,
      industryLevelThreeCode,
      industryLevelFourCode,
    ].filter(t => !!t);
    // 法人代表证件到期日
    this.model.corpCertificateLimitDate = MinUtils.getDateTime(corpCertificateLimitDate);
    // 注册地址
    const registeredAddress = this.getRegisteredAddress(bussinessInfo);
    this.model.registeredAddress = registeredAddress;
    this.cdr.markForCheck();
  }

  /**
   * 注册地址信息过滤
   * @param bussinessInfo
   * @returns
   */
  getRegisteredAddress(bussinessInfo: any) {
    const {
      // 省市区层级
      registeredAddressLevel,
      // 省
      registeredProvinceCode,
      // 市
      registeredCityCode,
      // 区
      registeredCountyCode,
      // 具体地址
      registeredAddress
    } = bussinessInfo;
    return {
      city: registeredAddressLevel === AreaLevelEnum.PROVINCE
        ? registeredProvinceCode : registeredCityCode,
      detail: registeredAddress,
      province: registeredProvinceCode,
      region: registeredAddressLevel === AreaLevelEnum.PROVINCE ?
        registeredProvinceCode :
        registeredAddressLevel === AreaLevelEnum.AREA ? registeredCountyCode : null
    };
  }

  /**
   * 证件审核信息处理
   * @param fileName 文件名
   * @param idCheckStatus 审核状态
   * @param remark 审核不通过原因
   */
  getIdCardCheckInfo(
    fileName: string,
    idCheckStatus: string,
    remark: string
  ) {
    return {
      fileName: fileName,
      checkText: this.optionPipe.transform(idCheckStatus, AuditStatusOptions),
      iconType: this.optionPipe.transform(idCheckStatus, AuditIconTypeOptions),
      nzColor: this.optionPipe.transform(idCheckStatus, AuditIconColorOptions),
      showReason: idCheckStatus === AuditStatusEnum.AUDIT_FAILURE,
      checkReason: remark,
    };
  }


  /**
   * 国籍枚举
   */
  fetchNationalOptions() {
    this.xn.middle.post('/bos/enum/country/list', {}).subscribe((x) => {
      if (x.code === RetCodeEnum.OK) {
        this.options.formState.nationalOptions = x.data.countryList.map(
          (t: any) => {
            return { label: t.countryName, value: t.twoLetterCode };
          }
        );
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * 查询客户类别枚举
   */
  fetchCustTypeOptions() {
    this.xn.middle.post('/bos/enum/customer/list', {}).subscribe((x) => {
      if (x.code === RetCodeEnum.OK) {
        this.options.formState.custTypeOptions = x.data.customerList.map(
          (t: any) => {
            return { label: t.customerType, value: t.customerCode };
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
   * 提交
   */
  submitForm() {
    if (this.isNewAcctName()) {
      // 是否修改电子账本户名
      this.$modal.confirm(
        {
          nzTitle: '提示',
          nzContent: '由于您已修改了企业电子账本户名，需要选择一张已有的绑定银行账户去激活账户信息',
          nzOkText: '确定',
          nzCancelText: '取消',
          nzOnOk: () => {
            this.showBankModal = true;
          },
          nzOnCancel: () => { }
        }
      );
    } else if (this.isNewCorpInfo()) {
      // 当法人的“姓名、手机号、身份证号”任一发生变更时，在“修改页面”点击提交时，需弹窗重新上传“授权书”。
      const {
        corpName,
        corpIdNo,
        corpMobile,
        identityNo
      } = this.model;
      const {
        name: operatorName,
        idNo: operatorIdNo,
        mobile: operatorMobile
      } = this.operatorInfo;
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
        .subscribe((authorizationKey: string) => {
          if (authorizationKey) {
            const newInfo = this.filterFromValue();
            newInfo.authorizationKey = authorizationKey;
            this.doRequest(newInfo);
          }
        });
    } else {
      const newInfo = this.filterFromValue();
      this.doRequest(newInfo);
    }
  }

  /**
   * 提交信息过滤处理
   */
  filterFromValue() {
    const formValue = XnUtils.deepClone(this.model);
    for (const key in formValue) {
      switch (key) {
        // date
        case 'corpCertificateLimitDate':
          formValue[key] = moment(formValue[key]).format('YYYYMMDD');
          break;
        // fileKey
        case 'corpIdFrontKey':
        case 'corpIdBackKey':
        case 'businessLicenseKey':
        case 'authorizationKey':
          formValue[key] = MinUtils.filterFileKey(formValue[key]);
          break;
        // 行业代码
        case 'industryCode':
          formValue['industryCode'] = formValue[key].filter(t => !!t).reverse()[0];
          break;
        // 注册地址
        case 'registeredAddress':
          const {
            province,
            city,
            region
          } = formValue[key];
          /** 地址代码和地址层级数据过滤 */
          if (province) {
            // 地址有省代码
            formValue['registeredAddressCode'] = province;
            formValue['registeredAddressLevel'] = AreaLevelEnum.PROVINCE;
          }
          if (city) {
            formValue['registeredAddressCode'] = city;
            // 省代码与市代码相同，层级取省一级
            formValue['registeredAddressLevel'] = province === city ? AreaLevelEnum.PROVINCE : AreaLevelEnum.CITY;
          }
          if (region) {
            formValue['registeredAddressCode'] = region;
            // 区代码与市代码相同，需要判断省代码与市代码是否相同。若相同层级取省一级，否则层级取市一级
            formValue['registeredAddressLevel'] = region === city ?
              province === city ? AreaLevelEnum.PROVINCE : AreaLevelEnum.CITY : AreaLevelEnum.AREA;
          }
          break;
        default:
          break;
      }
    }

    const registeredAddress = formValue['registeredAddress']['detail'];
    const {
      depositHuman,
      companyDesc,
      virAcctName,
      corpName,
      corpCardType,
      corpIdNo,
      corpCertificateLimitDate,
      corpMobile,
      corpCountryCode,
      corpIdFrontKey,
      corpIdBackKey,
      custIdTypeCode,
      enterprisScale,
      workAddPhone,
      registeredAddressCode,
      registeredAddressLevel,
      registeredType,
      industryCode,
      workAddress,
      businessLicenseKey,
      authorizationKey
    } = formValue;
    const params: any = {
      accountId: this.accountId,
      depositHuman,
      companyDesc,
      virAcctName,
      corpName,
      corpCardType,
      corpIdNo,
      corpCertificateLimitDate,
      corpMobile,
      corpCountryCode,
      corpIdFrontKey,
      corpIdBackKey,
      custIdTypeCode,
      enterprisScale,
      workAddPhone,
      registeredType,
      industryCode,
      workAddress,
      registeredAddressCode,
      registeredAddressLevel,
      registeredAddress,
      businessLicenseKey,
      authorizationKey
    }
    return params;
  }

  /**
   * 是否修改了企业电子账本户名
   * @returns
   */
  isNewAcctName(): boolean {
    const oldAcctName = this.bussinessInfo.virAcctName;
    const newAcctName = this.model.virAcctName;
    return oldAcctName !== newAcctName;
  }

  /**
   * 是否修改了法人信息
   * @returns
   */
  isNewCorpInfo(): boolean {
    let { corpName: oldCorpName, corpIdNo: oldCorpIdNo, corpMobile: oldCorpMobile } = this.bussinessInfo;
    let { corpName: newCorpName, corpIdNo: newCorpIdNo, corpMobile: newCorpMobile } = this.model;
    // 判断法人的“姓名、手机号、身份证号”是否变更
    return (oldCorpName !== newCorpName) || (oldCorpIdNo !== newCorpIdNo) || (oldCorpMobile !== newCorpMobile);
  }

  /**
   * 提交修改信息请求
   * @param params
   */
  doRequest(params: any) {
    this.xn.loading.open();
    this.xn.middle
      .post('/account/info/business/edit', params)
      .subscribe({
        next: (res: any) => {
          this.xn.loading.close();
          if (res.code === RetCodeEnum.OK) {
            this.message.success('信息提交成功，请耐心等待平台审核！');
            this.xn.router
              .navigate(['index'], {
                relativeTo: this.router.parent,
              })
              .then();
          }
        },
        error: () => {
          this.xn.loading.close();
        }
      });
  }

  /**
   * 发送法人手机验证码
   * @param
   */
  sendCorpSms(mobile: string) {
    const params: AccountEditModelParams = {
      width: 650,
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
            mobile: mobile,
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
          this.confirmSubmit(smsCode);
        }
      });
  }

  /**
   * 修改信息
   */
  editFrom() {
    // 账户状态
    const accountStatus = this.bussinessInfo.accountStatus || '';
    if (accountStatus === AccountStatusTypeEnum.MODIFIY ||
      (accountStatus === AccountStatusTypeEnum.ACCOUNT_OPENED &&
        this.bussinessInfo.isActivate === InfoActiveEnum.INACTIVATED)
    ) {
      return this.$modal.warning(
        {
          nzTitle: '提示',
          nzContent: '工商信息尚未激活,请点击去激活按钮完成激活工商账户信息操作',
          nzOkText: '去激活',
          nzCancelText: '取消',
          nzOnOk: () => {
            this.xn.router
              .navigate(['active-business', this.accountId], {
                relativeTo: this.router.parent,
              })
              .then();
          },
          nzOnCancel: () => { }
        }
      )
    }
    if (
      [AccountStatusTypeEnum.ACCOUNT_OPENED,
      AccountStatusTypeEnum.BUSINESS_REJECT].includes(accountStatus)
    ) {
      this.xn.router.navigate(['business-info/edit', this.accountId], {
        relativeTo: this.router.parent,
      }).then();
    } else {
      this.message.warning('当前状态不允许修改信息！');
    }
  }

  closeBankModal() {
    this.showBankModal = false;
  }

  /**
   * 选择绑定银行账号
   * @param e
   */
  bankModalOk(e: any) {
    this.showBankModal = false;
    const { bankId } = e;
    const newInfo = this.filterFromValue();
    newInfo.bankId = bankId;
    this.doRequest(newInfo);
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
    const { needSmsCode, isEditAcctName } = this.bussinessInfo;
    if (isEditAcctName) {
      // 是否电子账本户名
      this.$modal.confirm(
        {
          nzTitle: '提示',
          nzContent: '由于您已修改了企业电子账本户名，需要选择一张已有的绑定银行账户去激活账户信息',
          nzOkText: '确定',
          nzCancelText: '取消',
          nzOnOk: () => {
            this.showBankModal = true;
          },
          nzOnCancel: () => { }
        }
      );
    } else if (needSmsCode) {
      // 修改了法人手机，需要传法人旧手机验证码
      const { originalMobile } = this.bussinessInfo; // 原手机号
      this.sendCorpSms(originalMobile);
    } else {
      // 未修改手机不用传验证码
      this.confirmSubmit();
    }
  }

  /**
   * 提交确认修改请求
   * @param smsCode 法人手机验证码
   */
  confirmSubmit(smsCode?: string) {
    this.xn.loading.open();
    this.xn.middle.post2('/account/info/business/comfirm', { accountId: this.accountId, smsCode }).subscribe({
      next: (res: any) => {
        this.xn.loading.close();
        if (res.code === RetCodeEnum.OK) {
          if (res.data.isActivate === InfoActiveEnum.INACTIVATED) {
            this.$modal.warning(
              {
                nzTitle: '提示',
                nzContent: '账户信息已修改成功，待激活',
                nzOkText: '去激活',
                nzCancelText: '取消',
                nzOnOk: () => {
                  this.xn.router
                    .navigate(['active-business', this.accountId], {
                      relativeTo: this.router.parent,
                    })
                    .then();
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
            // 修改了法人手机，需要传法人旧手机验证码
            const { originalMobile } = this.bussinessInfo; // 原手机号
            this.sendCorpSms(originalMobile);
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
      AccountStatusTypeEnum.BUSINESS_CONFIRM,
      AccountStatusTypeEnum.BUSINESS_REJECT
    ].includes(this.bussinessInfo.accountStatus) &&
      [PageTypeEnum.CONFIRM, PageTypeEnum.EDIT].includes(this.pageType);
  }
}
