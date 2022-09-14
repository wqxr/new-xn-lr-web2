/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\form\mode-edit-product\mode-edit-product.component.ts
 * @summary：mode-edit-product.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-20
 ***************************************************************************/
import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SelectOptions } from '../../../config/select-options';
import { XnService } from '../../../services/xn.service';
import { XnUtils } from '../../../common/xn-utils';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { OrgRightModalComponent } from '../../modal/org-right-modal.component';

interface OrgRightInfo {
  orgType: number;
  orgTypeId: number;
  productIds: string[];
  factoringAppId?: number;
  agencyTypes?: number[];
  agencyTypeOptions?: any[];
  alert?: any;
  facAlert?: any;
}

@Component({
  selector: 'lib-formly-field-mode-edit-product',
  templateUrl: './mode-edit-product.component.html',
  styleUrls: ['./mode-edit-product.component.css']
})
export class ModeEditProductComponent extends FieldType implements OnInit, AfterContentChecked, OnDestroy {
  applyFactoringOptions = SelectOptions.get('applyFactoringOptions');
  agencyTypeOptions = SelectOptions.get('agencyType');

  orgPermission: any;
  orgRightInfo: OrgRightInfo[] = []; // 权限信息
  /** 中介机构 */
  AGENCY_TYPE = 102;
  /** 最多4条 */
  MAX_LENGTH = 4;

  get orgOptions() {
    return this.to.options as { label: string, value: number, orgTypeId: number }[];
  }

  get productTree() {
    return this.to.tree;
  }

  /** 默认的、预设的权限信息 */
  get defaultOrgInfo() {
    return {orgType: 0, orgTypeId: 0, productIds: []};
  }

  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef
  ) {
    super();
  }

  ngOnInit(): void {
    // console.log(this.model);
    // console.log(this.to);
  }

  ngAfterContentChecked(): void {
    this.init();
  }

  ngOnDestroy(): void {
    console.log('mode-edit-product-field destroy');
  }

  /** 初始化入口 */
  init() {
    // 能重置 && orgRightInfo 有值
    if (this.to.resetOrgItem && this.model.orgRightInfo) {
      const {orgRightInfo} = this.model;
      this.initOrgRightInfo(orgRightInfo);
      this.to.resetOrgItem = false;
    }
  }

  initOrgRightInfo(orgRightInfo: any[]) {
    this.orgRightInfo = [];
    if (this.judgeArray(orgRightInfo)) {
      this.orgRightInfo = orgRightInfo.map((c) => {
        c.orgType = Number(c.orgType);
        /** 102 中介机构时，回显所勾选的中介机构类型 */
        if (c.orgType === this.AGENCY_TYPE) {
          const agencyTypeOptions = this.agencyTypeOptions
            .map((d) => ({...d, checked: c.agencyTypes ? c.agencyTypes.includes(d.value) : false}));
          return {...c, factoringAppId: Number(c.factoringAppId), agencyTypeOptions};
        }
        return c;
      });
    } else {
      this.orgRightInfo.push(this.defaultOrgInfo); // 默认显示一组
    }
    this.initValue();
  }

  /** 增加一组 */
  addOrg() {
    this.orgRightInfo.push(this.defaultOrgInfo);
    this.setValue(null);
  }

  /** 删除一组 */
  delOrg(index) {
    this.orgRightInfo.splice(index, 1);
    this.initValue();
  }

  /** 选择保理商 */
  onFacSelect(e: number, i: number) {
    if (e) {
      this.orgRightInfo[i].factoringAppId = !!Number(e) ? Number(e) : e;

      if (this.validFactoring()) {
        return this.initValue();
      }
      this.setValue(null);
    }
  }

  /** 校验保理商唯一性，return false 有误，true 通过 */
  validFactoring() {
    let count = true;
    for (const key of this.orgRightInfo) {
      /** orgType 是 中介机构 */
      if (key.orgType === this.AGENCY_TYPE) {
        let validRes = true;
        const factoring = key.factoringAppId;
        validRes = this.orgRightInfo.filter((c) => c.factoringAppId === factoring).length <= 1;
        if (validRes) {
          key.facAlert = undefined;
        } else {
          count = false;
          key.facAlert = '保理商不可重复';
        }
      }
    }
    return count;
  }

  /** 中介机构类型 */
  agencyChange(val: any[], i) {
    this.orgRightInfo[i].agencyTypes = val.filter((c) => c.checked).map((c) => c.value);
    this.initValue();
  }

  /** 选择机构类型 */
  handleSelect(e: number, i: number) {
    const org = this.orgOptions.find((c) => c.value === e);
    this.orgRightInfo[i].orgType = org.value;
    this.orgRightInfo[i].orgTypeId = org.orgTypeId;

    if (e === this.AGENCY_TYPE) {
      this.orgRightInfo[i].factoringAppId = null;
      this.orgRightInfo[i].agencyTypes = [];
      this.orgRightInfo[i].agencyTypeOptions = XnUtils.deepClone(this.agencyTypeOptions);
    } else {
      this.orgRightInfo[i].productIds = [];
    }

    if (!this.validOrgType()) {
      this.setValue(null);
    }
  }

  /** 非 102中介机构类型 的机构类型不能重复 */
  validOrgType() {
    let result = true;
    const hash: any = {};

    for (const key of this.orgRightInfo) {
      /** 检查非 102 机构的数据 */
      if (key.orgType !== this.AGENCY_TYPE) {
        // 已存在相同机构
        if (hash[key.orgType]) {
          result = false;
          this.alertInfo(key.orgType);
          break;
        }
        hash[key.orgType] = true;
      }
    }
    if (result) {
      this.alertInfo();
    }
    return result;
  }

  /**
   * 将指定 orgType 的数据增加警告信息
   * @param orgType 机构类型
   */
  alertInfo(orgType?: number) {
    this.orgRightInfo = this.orgRightInfo.map((c) => {
      c.alert = undefined;
      if (c.orgType === null) {
        c.alert = '请选择机构类型';
      }
      if (c.orgType === orgType) {
        c.alert = '非 "中介机构" 类型的 "机构类型" 不能重复';
      }
      return c;
    });
  }

  /** 是否为数组，且长度大于零 */
  judgeArray(arr: any[]) {
    return arr && arr instanceof Array && arr.length > 0;
  }

  /** 编辑权限 */
  onEdit(item) {
    const orgName = this.orgOptions.filter(t => t.value === item.orgType)[0].label;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      OrgRightModalComponent,
      {
        orgName,
        productTree: this.productTree,
        orgPermission: {1: item.productIds} || {},
      }
    ).subscribe(({action, orgPermission}) => {
      if (action === 'ok') {
        item.productIds = [...new Set(orgPermission[1])]; // 勾选的权限
        this.initValue();
      }
    });
  }

  private initValue() {
    const invalid = this.orgRightInfo.some(x => {
      if (x.orgType === this.AGENCY_TYPE) {
        return !x.factoringAppId || !(x.agencyTypes && x.agencyTypes.length);
      } else {
        return !x.orgType || !this.judgeArray(x.productIds);
      }
    });

    if (invalid) {
      return this.setValue(null);
    }

    const infos = this.orgRightInfo.map((c) => {
      const {orgType, orgTypeId, productIds} = c;
      return {orgType, orgTypeId, productIds};
    });

    console.log(this.orgRightInfo, infos);
    this.setValue(infos);
  }

  /** 设置表单值 */
  setValue(val: any) {
    this.form.controls[this.to.fieldKey]?.setValue(val);
  }
}
