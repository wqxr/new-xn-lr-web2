/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\management\mode-edit-relate-right\mode-edit-relate-right.component.ts
 * @summary：mode-edit-relate-right.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-20
 ***************************************************************************/
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, Observer, of } from 'rxjs';
import { XnUtils } from '../../../../../shared/src/lib/common/xn-utils';

// 修改模式组件
@Component({
  selector: 'lib-mode-edit-relate-right',
  templateUrl: './mode-edit-relate-right.component.html',
  styles: [`
    .edit-form {
      margin-top: 15px;
    }
  `]
})
export class ModeEditRelateRightComponent implements OnInit, AfterViewChecked {
  // 页面标题
  pageTitle = '模式修改';

  /** 搜索表单 */
  searchForm = new FormGroup({});
  searchFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'ant-row',
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-11 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'systemId',
          type: 'select',
          templateOptions: {
            label: '所在系统',
            nzPlaceHolder: '请选择',
            required: true,
            labelSpan: 6,
            nzAllowClear: true,
            controlSpan: 18,
          },
          expressionProperties: {
            'templateOptions.options': 'formState.sysOptions',
          },
        },
        {
          className: 'ant-col ant-col-offset-1 ant-col-md-11 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'appName',
          type: 'input',
          templateOptions: {
            label: '公司名称',
            placeholder: '请输入',
            required: true,
            labelSpan: 6,
            controlSpan: 18,
          },
        },
      ],
    },
  ];

  /** 编辑产品表单 */
  editForm = new FormGroup({});
  editFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-offset-2 ant-col-md-16 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'appName',
      type: 'input',
      templateOptions: {
        label: '企业名称',
        disabled: true,
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-offset-2 ant-col-md-16 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'orgRightInfo',
      type: 'mode-edit-product-field',
      templateOptions: {
        label: '该机构的权限',
        required: true,
        labelSpan: 6,
        controlSpan: 18,
        /** 表单项的 key */
        fieldKey: 'orgRightInfo',
      },
      expressionProperties: {
        'templateOptions.options': 'formState.orgOptions',
        'templateOptions.tree': 'formState.productTree',
        'templateOptions.resetOrgItem': 'formState.resetOrgItem',
      },
    },
  ];
  editModel: any = {};

  options: FormlyFormOptions = {
    formState: {
      /** 所有系统 */
      sysOptions: [],
      /** 所有机构 */
      orgOptions: [],
      /** 产品树 */
      productTree: {},
      /** 重置 orgRightInfo 表单项 */
      resetOrgItem: false
    },
  };
  /** 是否搜索过 */
  isSearched = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
  ) {}

  // 输入内容
  public inputValue: string;

  ngOnInit() {
    this.fetchSysList();
    // this.searchResult('深圳市创捷供应链有限公司');
  }

  /**
   * 获取企业已注册的系统列表
   */
  fetchSysList() {
    this.xn.api.post('/product_right/all_system', {})
      .subscribe(
        {
          next: (res) => {
            this.formatSysOptions(res.data);
          },
          error: (err) => {
            this.msg.error(err.msg || '获取系统列表失败');
          },
        }
      );
  }

  /**
   * 格式化系统列表信息
   * @param data 系统列表
   */
  formatSysOptions(data: { systemList: any[] }) {
    if (data.systemList && data.systemList.length) {
      this.options.formState.sysOptions = data.systemList.map((c) => {
        return {
          label: c.name,
          value: c.systemId,
        };
      });
    }
  }

  /**
   * 格式化机构列表信息
   * @param orgTypeList 机构列表
   */
  formatOrgOptions({orgTypeList}) {
    if (orgTypeList && orgTypeList.length) {
      this.options.formState.orgOptions = orgTypeList.map((c) => {
        return {
          label: c.orgName,
          value: c.orgType,
          orgTypeId: c.orgTypeId,
        };
      });
    }
  }

  /** productTree */
  formatProductTree({productTree}) {
    this.options.formState.productTree = productTree;
  }

  /** 执行搜索 */
  doSearch() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.valid) {
      const appName = this.searchForm.value.appName.replace(/\s+/g, '');
      const systemId = this.searchForm.value.systemId;
      // console.log(appName, systemId);
      this.searchResult({systemId, appName});
    }
  }

  public searchResult(val: { systemId: number, appName: string }) {
    const search$ = this.xn.api.post('/product_right/app_org_product', val);
    const base$ = this.xn.api.post('/product_right/system_org_product', {systemId: val.systemId});

    search$.pipe(
      catchError(err => {
        this.msg.error(err.msg || '搜索失败');
        return of(null);
      }),
      mergeMap(res => {
        if (!XnUtils.isEmptys(res)) {
          // 使用 orgRightInfo 作为表单 key
          const orgRightInfo = res.data.orgTypeList.map((c) => {
            return {
              ...c,
              productIds: c.orgProductList.map((d) => d.productId)
            };
          });
          this.editModel = {...res.data, orgRightInfo};
          this.options.formState.resetOrgItem = true;
          const {orgOptions, productTree} = this.options.formState;
          if (!orgOptions.length || XnUtils.isEmptys(productTree)) {
            return base$;
          } else {
            // 如果 orgOptions, productTree 有数据了就不在请求了
            return of(null);
          }
        } else {
          this.msg.warning(`未查询到 ${val.appName} 的信息`);
        }
      })
    )
      .subscribe({
        next: (res) => {
          if (res) {
            this.formatOrgOptions(res.data);
            this.formatProductTree(res.data);
            this.isSearched = true;
          }
        },
        error: (err) => {
          this.msg.error(err.msg || '获取系统下所有机构类型及产品失败');
        },
      });
  }

  //  保存修改模式
  public save() {
    // console.log(this.editModel);
    const {appId, appName, orgRightInfo} = this.editModel;
    const params = {
      systemId: this.searchForm.value.systemId,
      appId, appName,
      orgTypes: orgRightInfo,
    };

    this.xn.api.post('/product_right/save_app_org_product', params)
      .subscribe(() => {
        this.xn.msgBox.open(false, '保存成功', () => {});
      });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  /**
   * 返回到旧版模式修改
   */
  navToOld() {
    this.xn.router.navigate(['/console/manage/mode-modification']);
  }
}

// 修改模型组件提交类
export class InputModel {
  // 企业名称
  public appName?: string;
  // 企业id
  public appId?: string;
  // 企业类型
  public orgType?: number;
  /** 同企业类型 */
  public defaultOrg?: string;
  // 产品id
  public custom?: string[];
  public orgright?: string;
}
