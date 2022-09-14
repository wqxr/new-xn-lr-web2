import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef, OnChanges, SimpleChanges
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from '../../services/xn.service';

import { XnModalUtils } from '../../common/xn-modal-utils';
import { OrgRightModalComponent } from '../modal/org-right-modal.component';
import { SelectOptions } from '../../config/select-options';
import { XnUtils } from '../../common/xn-utils';
import { GuaranteeAgencyTypes, RegisterFlowType, RegisterFlowTypes } from '../../config/enum';

/**
 *  权限
 */
@Component({
  selector: 'xn-org-right-input',
  templateUrl: './org-right-input.component.html',
  styles: [
    `
      .row {
        padding-right: 15px;
        padding-left: 15px;
      }

      .row a {
        cursor: pointer;
      }
    `,
    `
      .xn-input-font {
        font-weight: normal;
        margin-right: 10px;
      }
    `,
  ],
})
export class OrgRightInputComponent implements OnInit, OnChanges {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;
  @Input() canEdit = true;

  ctrl: AbstractControl;
  patterns: any[] = [];

  defaultOrg: string;
  orgPermission: any = {};
  selectedOrgPermissionInfo: any;
  orgRightInfo: any[] = []; // 权限信息

  /** 中介机构 */
  AGENCY_TYPE = '102';

  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    let _patterns: any[] = String(this.svrConfig?.registerType) === RegisterFlowType.PatternWithGuaranteeAgency.toString() ? 
      (this.svrConfig?.orgTypeList || [])
      .filter((y: any) => String(y.orgType) !== GuaranteeAgencyTypes.Guest.toString())
      .map((x: any) => {return {label: x.orgName, value: String(x.orgType)}}) : SelectOptions.get('patternWithAgency');
    this.patterns = [..._patterns];
    this.orgRightInfo.push({type: '', orgInfo: {}}); // 默认显示一组
    if (this.row.value) {
      const {orgRightInfo, defaultOrg} = JSON.parse(this.row.value);
      this.orgRightInfo = [];
      for (const key in orgRightInfo) {
        const orgInfo = {};
        orgInfo[key] = orgRightInfo[key];
        this.orgRightInfo.push({type: key.toString(), orgInfo: {...orgInfo}});
      }

      this.initValue(orgRightInfo, defaultOrg);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.form.currentValue.value.orgRightInfo) { return; }
    const {orgRightInfo} = JSON.parse(changes.form.currentValue.value.orgRightInfo) || {orgRightInfo: {}};
    this.orgRightInfo = [];
    if (this.judgeObject(orgRightInfo)) {
      for (const key in orgRightInfo) {
        const orgInfo = {};
        orgInfo[key] = orgRightInfo[key];
        this.orgRightInfo.push({type: key.toString(), orgInfo: {...orgInfo}});
      }
    }

  }

  // 增加一组
  addOrg() {
    this.orgRightInfo.push({type: '', orgInfo: {}});
    this.ctrl.setValue('');
  }

  // 删除一组
  delOrg(index) {
    this.orgRightInfo.splice(index, 1);
    const defaultOrgType = Number(this.orgRightInfo[0].type);
    const orgPermissionInfo = {};
    this.orgRightInfo.forEach(v => {
      orgPermissionInfo[Number(v.type)] = v.orgInfo[Number(v.type)];
    });
    this.initValue(orgPermissionInfo, defaultOrgType);
  }

  // 选择机构类型
  handleSelect(e: any, i: number) {
    if (!!e) {
      this.orgRightInfo[i].orgInfo = {};
      this.orgRightInfo[i].alert = undefined;
      if (this.checkOrgEq(e.target.value)) {
        this.orgRightInfo[i].alert = '机构类型不可重复';
      } else {
        this.orgRightInfo[i].alert = undefined;
        /** 中介机构操作 */
        if (e.target.value === this.AGENCY_TYPE) {
          const defaultOrgType = Number(this.orgRightInfo[0].type);
          const orgPermissionInfo = {};
          this.orgRightInfo.forEach(v => {
            orgPermissionInfo[Number(v.type)] = v.orgInfo[Number(v.type)] || [];
          });
          this.initValue(orgPermissionInfo, defaultOrgType);
        }
      }
    }
    this.valid();
  }

  /** 判断 当前所选的 中介机构是否重复 */
  checkOrgEq(val: string) {
    return this.orgRightInfo.filter(x => x.type === val).length > 1;
  }

  valid() {
    const ok = this.orgRightInfo
      /** 排除中介机构类型的数据 */
      /** 因为中介机构类型是不用选择权限的，所以移除后判断 */
      .filter(x => x.type !== this.AGENCY_TYPE)
      /** 排除机构权限为：中介机构的数据后，剩下的数据是否 选择了机构类型和权限 */
      .filter(x => !x.type || !x.orgInfo || XnUtils.isEmptys(x.orgInfo))
      .length > 0;
    /** 如果有未选择 true 的数据，表单项置空 */
    if (ok) {
      this.ctrl.setValue('');
    }
    return ok;
  }

  judgeObject(objet: object) {
    return Object.keys(objet).length > 0;
  }

  // 编辑权限
  onEdit(item) {
    const orgName = this.patterns.filter(t => t.value === item.type)[0].label;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      OrgRightModalComponent,
      {
        orgName,
        productTree: this.svrConfig.productTree,
        orgPermission: {1: item.orgInfo[Number(item.type)]} || {},
        defaultOrg: Number(item.type) || '',
        registerType: this.svrConfig?.registerType,
      }
    ).subscribe(({action, orgPermission}) => {
      if (action === 'ok') {
        item.orgInfo[Number(item.type)] = [...new Set(orgPermission[1])]; // 勾选的权限
        const defaultOrgType = Number(this.orgRightInfo[0].type); // 默认机构
        const orgPermissionInfo = {};
        this.orgRightInfo.forEach(v => {
          orgPermissionInfo[Number(v.type)] = v.orgInfo[Number(v.type)];
        });
        this.initValue(orgPermissionInfo, defaultOrgType);
      }
    });
  }

  private initValue(orgPermission, defaultOrg) {
    this.orgPermission = {};
    for (const key of Object.keys(orgPermission)) {
      if (orgPermission.hasOwnProperty(key)) {
        if (key + '' === this.AGENCY_TYPE) {
          this.orgPermission[key] = orgPermission[key] || [];
        } else {
          this.orgPermission[key] = orgPermission[key];
        }
      }
    }
    this.defaultOrg = defaultOrg;

    let _defaultTree = XnUtils.deepCopy(this.svrConfig?.productTree.sub, []);
    let _orgTypes = Object.keys(this.orgPermission).map((x: string | number) => {
      return {
        orgType: Number(x),
        orgTypeId: this.svrConfig?.orgTypeList?.find((y: any) => String(y.orgType) === String(x))?.orgTypeId,
        productIds: XnUtils.treeFilter(_defaultTree || [], [], (node: any) =>
          !node.sub?.length &&
          !!node.product &&
          (this.orgPermission[x]?.includes(node.product?.code) || this.orgPermission[x]?.includes(node.product?.id))
        )?.map((p: any) => p.product?.id)
      }
    })
    if (!this.valid()) {
      this.ctrl.setValue({
        orgRightInfo: this.orgPermission,
        defaultOrg,
        orgTypes: _orgTypes
      });
    }
  }

  // private getOrgInfo(orgPermission: any): any {
  //   return Object.keys(orgPermission).map((key) => {
  //     const pattern = this.patterns.find((x) => x.value === key);
  //
  //     return {
  //       org: pattern.label,
  //       defaultOrg: pattern.value.toString() === this.defaultOrg.toString(),
  //       permission: this.getTreeItem(
  //         this.svrConfig.productTree,
  //         orgPermission[key]
  //       ).join(','),
  //     };
  //   });
  // }
  //
  // private getTreeItem(tree, values) {
  //   const stack = [tree];
  //   const result = [];
  //
  //   while (stack.length) {
  //     const node = stack.pop();
  //     const isLeafNode = node.type === 2; // 叶子节点
  //     if (isLeafNode && node.product && values.includes(node.product.id)) {
  //       result.push(node.product.name);
  //     }
  //
  //     if (node.sub) {
  //       node.sub.forEach((x) => stack.push(x));
  //     }
  //   }
  //
  //   return result;
  // }
  //
  // private onClear() {
  //   if (JSON.parse(this.ctrl.value).length === 0) {
  //     return;
  //   }
  //   this.ctrl.setValue(JSON.stringify(this.ctrl.value));
  // }
}
