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
  selector: 'xn-org-right-input-modal',
  templateUrl: './org-right-input-modal.component.html',
  styles: [
    `
      .row {
        padding-right: 15px;
        padding-left: 15px;
      }

      .row a {
        cursor: pointer;
      }

      .ctr-wrap .fir-sx {
        margin-top: 10px;
      }

      .ctr-wrap:first-child .fir-sx {
        margin-top: 0;
      }

      :host ::ng-deep.ant-checkbox-group-item {
        width: 45%;
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
export class OrgRightInputModalComponent implements OnInit, OnChanges {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;
  @Input() canEdit = true;

  ctrl: AbstractControl;

  patterns: any[] = [];
  applyFactoringOptions = SelectOptions.get('applyFactoringOptions');
  agencyTypeOptions = SelectOptions.get('agencyType');

  // defaultOrg: string;
  orgPermission: any;
  selectedOrgPermissionInfo: any;
  orgRightInfo: OrgRightInfo[] = []; // 权限信息
  defaultOrg: string;
  /** 中介机构 */
  AGENCY_TYPE = '102';
  /** 最多4条 */
  MAX_LENGTH = 4;

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
    if (this.row.value) {
      const {orgRightInfo, defaultOrg} = JSON.parse(this.row.value);
      this.initOrgRightInfo(orgRightInfo);
      this.defaultOrg = defaultOrg;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // if (!changes.form.currentValue.value.orgRightInfo) { return; }
    // const {orgRightInfo} = JSON.parse(changes.form.currentValue.value.orgRightInfo) || {orgRightInfo: {}};
    // this.initOrgRightInfo(orgRightInfo);
  }

  initOrgRightInfo(orgRightInfo: any[]) {
    this.orgRightInfo = [];
    if (this.judgeArray(orgRightInfo)) {
      this.orgRightInfo = orgRightInfo.map((c) => {
        c.orgType = c.orgType + '';
        /** 中介机构时，回显所勾选的中介机构类型 */
        if (c.orgType === this.AGENCY_TYPE) {
          const agencyTypeOptions = this.agencyTypeOptions
            .map((d) => ({...d, checked: c.agencyTypes ? c.agencyTypes.includes(d.value) : false}));
          return {...c, factoringAppId: Number(c.factoringAppId), agencyTypeOptions};
        }
        return c;
      });
    } else {
      this.orgRightInfo.push({orgType: ''}); // 默认显示一组
    }
    if (this.ctrl) {
      this.initValue();
    }
  }

  /** 增加一组 */
  addOrg() {
    this.orgRightInfo.push({orgType: ''});
    this.ctrl.setValue('');
  }

  // 删除一组
  delOrg(index) {
    this.orgRightInfo.splice(index, 1);
    this.initValue();
  }

  /** 选择保理商 */
  onFacSelect(e: number, i: number) {
    if (e) {
      this.orgRightInfo[i].factoringAppId = !!Number(e) ? Number(e) : e;

      if (this.validFactoring()) {
        this.initValue();
      } else {
        this.ctrl.setValue('');
      }
    }
  }

  /** 校验保理商唯一性，return false 有误，true 通过 */
  validFactoring() {
    let count = true;
    for (let j = 0; j < this.orgRightInfo.length; j++) {
      /** orgType 是 中介机构 */
      if (this.orgRightInfo[j].orgType === this.AGENCY_TYPE) {
        let validRes = true;
        const factoring = this.orgRightInfo[j].factoringAppId;
        validRes = this.orgRightInfo.filter((c) => c.factoringAppId === factoring).length <= 1;
        if (validRes) {
          this.orgRightInfo[j].facAlert = undefined;
        } else {
          count = false;
          this.orgRightInfo[j].facAlert = '保理商不可重复';
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

  // 选择机构类型
  handleSelect(e: any, i: number) {
    if (!!e) {
      if (e.target.value === this.AGENCY_TYPE) {
        this.orgRightInfo[i].factoringAppId = null;
        this.orgRightInfo[i].agencyTypes = [];
        this.orgRightInfo[i].agencyTypeOptions = XnUtils.deepClone(this.agencyTypeOptions);
      } else {
        this.orgRightInfo[i].productIds = [];
      }
    }

    if (!this.validOrgType()) {
      this.ctrl.setValue('');
    }
  }

  /** 非中介机构类型的机构类型不能重复 */
  validOrgType() {
    let count = true;
    const orcs = this.orgRightInfo.filter((c, i) => {
      if (c.orgType !== this.AGENCY_TYPE) {
        this.orgRightInfo[i].alert = undefined;
      }
      return c.orgType !== this.AGENCY_TYPE;
    });

    for (let j = 0; j < orcs.length; j++) {
      const ids: number[] = [];
      let validRes = true;

      validRes = this.orgRightInfo
        .filter((c, i) => {
          if (c.orgType === orcs[j].orgType) {
            ids.push(i);
          }
          return c.orgType === orcs[j].orgType;
        })
        .length <= 1;
      if (!validRes) {
        count = false;
        ids.forEach((c) => {
          this.orgRightInfo[c].alert = '非 "中介机构" 类型的 "机构类型" 不能重复';
        });
      } else {
        ids.forEach((c) => {
          this.orgRightInfo[c].alert = undefined;
        });
      }
    }
    return count;
  }

  judgeArray(arr: any[]) {
    return arr && Array.isArray(arr) && arr.length > 0;
  }

  // 编辑权限
  onEdit(item) {
    const orgName = this.patterns.filter(t => t.value === item.orgType)[0].label;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      OrgRightModalComponent,
      {
        orgName,
        productTree: this.svrConfig.productTree,
        orgPermission: {1: item.productIds} || {},
        defaultOrg: this.defaultOrg,
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
    console.log(this.orgRightInfo);

    if (invalid) {
      return this.ctrl.setValue('');
    }
    this.ctrl.setValue({orgRightInfo: this.orgRightInfo});
  }
}

export interface OrgRightInfo {
  orgType?: string;
  productIds?: any[];
  factoringAppId?: number;
  agencyTypes?: number[];
  agencyTypeOptions?: any[];
  alert?: any;
  facAlert?: any;
}
