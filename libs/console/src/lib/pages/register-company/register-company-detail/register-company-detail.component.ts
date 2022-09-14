/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：注册公司详情页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying         upgrade         2021-06-21
 ***************************************************************************/
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Column } from '@lr/ngx-table';
import CompanyDetailConfigList from './register-company-detail-config';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditInfoModalComponent } from 'libs/shared/src/lib/public/component/edit-info-modal.component';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import {
  EditModalComponent,
  EditParamInputModel,
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { CheckersOutputModel } from '../../../../../../shared/src/lib/config/checkers';
import { FileViewModalComponent } from '../../../../../../shared/src/lib/public/modal/file-view-modal.component';
import { DragonMfilesViewModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { JsonTransForm } from '../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import {
  FitproductSo,
  SoSupplierInfoFieldType,
  SoSupplierInfoPostType,
  SoSupplierInfoUrl,
} from 'libs/shared/src/lib/config/enum';
import {
  RegisterStateOptions,
  ChannelOptions,
} from '../../../../../../shared/src/lib/config/options';
@Component({
  templateUrl: './register-company-detail.component.html',
  styles: [
    `
      .card-box {
        margin-bottom: 10px;
      }
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-descriptions-item-label {
        font-weight: bold;
      }
      ::ng-deep .ant-descriptions-item-label::after {
        content: '';
        position: relative;
        top: -0.5px;
        margin: 0 8px 0 2px;
      }
    `,
  ],
})
export class RegisterCompanyDetailComponent implements OnInit {
  // 企业id
  public appId: string = '';
  // 企业详情信息
  public detailInfo: any = {} as any;
  // loading
  public loading: boolean = true;
  //企业曾用名Column
  public originalNameColumn: Column[] =
    CompanyDetailConfigList.originalNameColumn;
  //企业曾用名data
  public originalNameList: any[];
  //产品信息
  public productInfoColumn: Column[] =
    CompanyDetailConfigList.productInfoColumn;
  //产品信息data
  public productInfo: any[];
  //数字证书信息Column
  public caInfoColumn: Column[] = CompanyDetailConfigList.caInfoColumn;
  //数字证书信息data
  public caInfo: any = {} as any;
  // 当前数字证书类型
  public caType: number = 0;
  //用户信息Column
  public userInfoColumn: Column[] = CompanyDetailConfigList.userInfoColumn;
  // 用户资质文件信息
  public certifyInfoColumn: Column[] = CompanyDetailConfigList.certifyInfoColumn;
  //用户信息data
  public userInfo: any[];
  //准入资料data
  public orgFileData: any = {} as any;
  public isAdministrator: boolean;
  public certifyInfo: any[] = [];

  get registerStateOptions() {
    return RegisterStateOptions;
  }

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService
  ) { }
  ngOnInit(): void {
    this.router.params.subscribe((params: Params) => {
      params.id && this.xn.user.isAdmin
        ? (this.isAdministrator = true)
        : (this.isAdministrator = false);
      this.appId = params.id;
    });
    this.onPage();
  }
  get channelOptions() {
    return ChannelOptions;
  }
  /**
   * 获取企业详情信息
   * @param appId  企业appId
   * @param
   * @summary
   */
  public onPage() {
    this.loading = true;
    forkJoin(
      this.xn.dragon.post('/app/app_details_info', { appId: this.appId }), // 企业详情信息
      this.xn.api.post('/jzn/product/get_app_product_list', {
        appId: this.appId,
        systemType: this.xn.user.systemType,
      }), // 企业产品信息
      this.xn.api.post('/custom/avenger/customer_manager/get_app_file', {
        appId: this.appId || null,
      }), // 企业文件/准入资料
      this.xn.api.post('/cert_info/get_cert_list', { appId: this.appId }),// 数字证书信息
      this.xn.api.dragon.post('/certify/certify_app_list', { appId: this.appId })
    ).subscribe(
      ([detailsInfo, productInfo, appFile, certInfo, certifyInfo]) => {
        this.loading = false;
        this.detailInfo = detailsInfo.data;
        this.originalNameList = this.detailInfo?.originalNameList || [];
        this.productInfo = productInfo.data;
        this.caInfo = certInfo.data.data;
        this.caType = Number(certInfo.data.caType);
        this.orgFileData = this.formValue(appFile.data, 1);
        this.certifyInfo = certifyInfo.data;
        this.certifyInfo.forEach((x:any)=>{
          if(x.certify_indate - new Date().getTime()>=0){
            x.status='已生效';
          }else{
            x.status='已过期';
          }
        })
      },
      (err: any) => {
        console.error(err);
        this.loading = false;
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * 终止申请
   * @param appId 企业Id
   */
  delRigister(appId: string | number) {
    this.xn.loading.open();
    this.xn.api.post('/user/del_register', { appId }).subscribe(
      (v: any) => {
        this.xn.loading.close();
        if (v.ret === 0) {
          this.modalService.success({
            nzTitle: '终止成功！',
            nzOkText: '确定',
            nzOnOk: () => window.history.go(-1),
          });
        } else {
          this.modalService.error({
            nzTitle: '终止失败！',
            nzOkText: '确定',
            nzOnOk: () => window.history.go(-1),
          });
        }
      },
      () => {
        this.xn.loading.close();
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   * 切换CA类型
   * @param
   */
  switchCa() {
    const certType = this.caInfo.map((x) => {
      x.label = SelectOptions.getConfLabel('caType', x.certType);
      x.value = x.certType;
      return {
        label: x.label,
        value: x.value,
      };
    });
    const params = {
      title: '修改当前使用证书类型',
      size: ModalSize.Large,
      checker: [
        {
          checkerId: 'caType',
          required: true,
          type: 'radio',
          title: '请选择',
          options: { ref: 'caType' },
          value: { value: this.caType.toString(), options: certType },
        },
      ],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditInfoModalComponent,
      params
    ).subscribe((v) => {
      if (v) {
        this.xn.loading.open();
        this.xn.api
          .post('/cert_info/update_cert_cfg', {
            caType: Number(v.caType),
            appId: this.appId,
          })
          .subscribe(
            (x) => {
              this.xn.loading.close();
              if (x.ret === 0) {
                this.caType = Number(v.caType);
              }
            },
            () => {
              this.xn.loading.close();
            }
          );
      }
    });
  }
  /**
   * 删除资质文件
   */
  deleteCertifyFile(paramId:number) {
    if(!this.xn.user.roles.includes('admin')){
        this.xn.msgBox.open(false,'非管理员不能操作！');
        return;
    }
    // this.xn.loading.open();
    this.xn.msgBox.open(true, [`是否<span style='color:red'>删除</span>此资质文件`], () => {
      this.xn.api.dragon.post('/certify/certify_delete_info',{id:paramId}).subscribe(x=>{
        if(x.ret===0){
            this.xn.msgBox.open(false,'删除成功');
            this.onPage();
        }
      })
  }, () => {
      return;
  }, ['取消', '删除']);

  }
  /**
   * 更换管理员
   */

  changeAdmin() {
    const params: EditParamInputModel = {
      title: '修改管理员',
      checker: [
        {
          title: '管理员姓名',
          checkerId: 'userName',
          type: 'text',
          validators: {
            cnName: true,
          },
          required: 1,
          value: '',
        },
        {
          title: '用户角色',
          checkerId: 'userRoleList',
          type: 'checkbox',
          selectOptions: [{ label: '管理员', value: 'admin', disabled: true }],
          required: false,
          value: 'admin',
        },
        {
          title: '证件类型',
          checkerId: 'cardType',
          type: 'select',
          selectOptions: [
            { label: '身份证', value: '身份证' },
            { label: '护照', value: '护照' },
          ],
          required: 1,
          value: '',
        },
        {
          title: '证件号码',
          checkerId: 'cardNo',
          type: 'text',
          validators: {
            card: {
              name: 'cardType',
            },
          },
          required: 1,
          value: '',
        },
        {
          title: '手机号',
          checkerId: 'mobile',
          type: 'text',
          validators: {
            mobile: true,
          },
          required: 1,
          value: '',
        },
        {
          title: '邮件',
          checkerId: 'email',
          type: 'text',
          validators: {
            email: true,
          },
          required: 1,

          value: '',
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (v === null) {
        return;
      } else {
        const param = Object.assign(v, { appId: this.appId });
        this.xn.api.post('/useroperate/modify_admin', param).subscribe((x) => {
          if (x.ret === 0) {
            this.onPage();
          }
        });
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
            ref: 'fitProduct_sh',
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
      let url: string = SoSupplierInfoUrl.Normal;
      let postType: string = [
        String(FitproductSo.So),
        String(FitproductSo.Sh),
      ].includes(obj.proxy)
        ? SoSupplierInfoPostType.So
        : SoSupplierInfoPostType.Normal;
      let fieldType = [
        String(FitproductSo.So),
        String(FitproductSo.Sh),
      ].includes(obj.proxy)
        ? SoSupplierInfoFieldType.So
        : SoSupplierInfoFieldType.Normal;
      if ([String(FitproductSo.So)].includes(obj.proxy)) {
        url = SoSupplierInfoUrl.So;
      } else if ([String(FitproductSo.Sh)].includes(obj.proxy)) {
        url = SoSupplierInfoUrl.Sh;
      }
      const param = { appId: this.appId };

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

  goBack() {
    window.history.go(-1);
  }
}
