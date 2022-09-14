import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ModalSize } from '../../common/modal/components/modal';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { XnUtils } from '../../common/xn-utils';
import { CheckersOutputModel } from '../../config/checkers';
import { FitproductSo } from '../../config/enum';
import { SelectOptions } from '../../config/select-options';
import { XnService } from '../../services/xn.service';
import { EditInfoModalComponent } from '../component/edit-info-modal.component';
import { EditModalComponent, EditParamInputModel } from '../dragon-vanke/modal/edit-modal.component';
import { DragonMfilesViewModalComponent } from '../dragon-vanke/modal/mfiles-view-modal.component';
import { JsonTransForm } from '../pipe/xn-json.pipe';
import { FileViewModalComponent } from './file-view-modal.component';

/**
 *  平台-注册公司详细信息
 */
@Component({
  templateUrl: './register-detail.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }

        .btn-right {
            float: right
        }

        .btn {
            padding: 4px 12px;
        }

        .table tr td .user-role {
            padding: 0
        }

        .table tr td .user-role li {
            position: relative;
            display: inline-block;
            float: left;
            padding-right: 15px;
        }`,
  ]
})
export class RegisterDetailComponent implements OnInit {

  pageTitle = '注册公司详细资料';
  pageDesc = '';
  tableTitle = '企业资料';
  adminTitle = '系统管理员';
  certTitle = '数字证书管理员';
  userTitle = '用户';
  notifier = '重要通知联系人';
  invoiceInfo = '开票信息';
  orgFile = '基础资料';  // 企业文件
  orgFileData: any = {} as any;
  isAdministrator = false;
  showEnterprise = true;
  items: any[] = [];
  data: any = {} as any;
  extendInfo: any = {} as any;
  invoiceData: any = {} as any;
  certTypeList: any[] = [];
  caType = 0;
  appId = '';
  public taxingType = SelectOptions.get('companyInvoice');


  public orgTypeLists = SelectOptions.get('orgType');
  public registerStatusLists = SelectOptions.get('registerStatus');
  // 管理员信息
  adminInfo: any = {} as any;
  constructor(public xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.xn.loading.open();
    this.route.params.subscribe((params: Params) => {
      params.id && this.xn.user.isAdmin ? this.isAdministrator = true : this.isAdministrator = false;
      this.appId = params.id;
      forkJoin(
        this.xn.api.post('/app_info/get_register_app', {
          appId: params.id
        }),
        this.xn.api.post('/useroperate/user_app_list', {
          appId: params.id
        }),
        this.xn.api.post('/app_info/get_tax_info', { appId: params.id }),
        this.xn.api.post('/custom/avenger/customer_manager/get_app_file', { appId: params.id || null }),  // 企业文件/准入资料
        // ).subscribe(([reg, app, taxInfo, org]) => {
        this.xn.api.post('/cert_info/get_cert_list', { appId: params.id })
      ).subscribe(([reg, app, taxInfo, org, certInfo]) => {
        this.data = reg.data;
        this.extendInfo = reg.data.extendInfo && JSON.parse(reg.data.extendInfo);
        this.items = app.data.data;
        this.adminInfo = this.items.filter((v: any) => {
          return v.userRoleList.findIndex((x: any) => { return x.roleId === 'admin' }) > -1
        })[0];
        this.invoiceData = taxInfo.data;
        this.orgFileData = this.formValue(org.data, 1);
        this.certTypeList = certInfo.data.data;
        this.caType = Number(certInfo.data.caType);
      }, () => {
        this.xn.loading.close();
      });
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
          title: '产品', checkerId: 'fitProduct', type: 'linkage-select', options: {
            ref: 'fitProduct_sh'
          }, required: true, value: ''
        }] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'sm'
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      if (!v) {
        return false;
      }
      const obj = XnUtils.parseObject(v.fitProduct, {});
      let url: string = '/custom/avenger/customer_manager/get_app_file';
      let postType: string = 'api';
      if([String(FitproductSo.So)].includes(obj.proxy)) {
          url = '/shanghai_bank/so_supplier/getSupplierInfo';
          postType = 'dragon';
      } else if([String(FitproductSo.Sh)].includes(obj.proxy)) {
          url = '/shanghai_bank/sh_supplier/getSupplierInfo';
          postType = 'dragon';
      }
      const param = { appId: this.appId };
      // const fieldType = [3, '3'].includes(obj.proxy) ? 0 : 1;
      
      this.xn[postType].post(url, param).subscribe((x: any) => {
        if (x && x.ret === 0 && x.data) {
          this.orgFileData = this.formValue(x.data, 0);
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
      XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
    } else if (type === 'dragon') {
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
    }
  }

  /**
   *  格式化特定数据json
   * @param paramInfo
   */
  private formValue(paramInfo: any, type: number) {
    const arr = !!type ? ['businessLicenseFile', 'certUserAuthorize', 'certUserCard', 'orgLegalCard', 'orgLegalCert', 'companyDecision', 'authorizationFile'] :
      ['businessLicenseFile', 'orgLegalCardFile', 'orgLegalCertFile', 'profitsRecognitionFile', 'profitsCardFile', 'companyDecisionFile', 'authorizeLetterFile', 'financeFile'];
    arr.map(key => paramInfo[key] = JsonTransForm(paramInfo[key]));
    return paramInfo;
  }

  public goBack() {
    this.xn.user.navigateBack();
  }
  public onViewEdit() {
    const certType = this.certTypeList.map(x => {
      x.label = SelectOptions.getConfLabel('caType', x.certType);
      x.value = x.certType;
      return {
        label: x.label,
        value: x.value,
      };
    }
    );
    if (certType.length > 1) {
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
          }
        ],
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(v => {
        if (v) {
          this.xn.api.post('/cert_info/update_cert_cfg', { caType: Number(v.caType), appId: this.appId }).subscribe(x => {
            if (x.ret === 0) {
              this.caType = Number(v.caType);
            }
          });
        }
      });

    } else {
      this.xn.msgBox.open(false, `当前只有${certType[0].label}的类型,无法切换`);
    }
  }

  /**
   * 终止申请
   * @param appId 企业Id
   */
  delRigister(appId: string | number) {
    this.xn.msgBox.open(true, '确定要终止申请吗？', () => {
      this.xn.loading.open()
      this.xn.api.post('/user/del_register', { appId }).subscribe(v => {
        this.xn.loading.close()
        if (v.ret === 0) {
          this.xn.msgBox.open(false, '终止成功！', () => {
            window.history.go(-1)
          })
        } else {
          this.xn.msgBox.open(false, '终止失败！', () => { })
        }
      }, () => {
        this.xn.loading.close()
      })
    })
  }

}
