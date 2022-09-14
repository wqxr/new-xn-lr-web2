import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../../common/modal/components/modal';
import {
  BusinessMode,
  EnterpriseMenuEnum,
  FactoringEnum,
} from '../../common/enums';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';

@Component({
  templateUrl: './login-select-modal.component.html',
  styles: [
    `
      .flex-row {
        display: flex;
        margin-bottom: -15px;
      }
      .pdf-container {
        width: 100%;
        height: calc(100vh - 280px);
        border: none;
      }
      .my-scroll {
        overflow-y: auto;
        max-height: calc(100vh - 260px);
      }
      .this-pdf {
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
      }
      .panel-default {
        margin-bottom: -4px;
      }
      .list-content {
        overflow-y: auto;
        max-height: 350px;
        padding: 2px 0;
      }
      .list-group {
        margin-bottom: -1px;
      }
      .panel-body {
        padding: 4px;
      }
      .nav > li {
        cursor: pointer;
      }
      .select-mode-label {
        line-height: 43px;
        float: left;
        padding-left: 30px;
      }
    `,
  ],
})
export class LoginSelectModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  private observer: any;

  params: any;
  items: any[] = [];

  constructor(public xn: XnService) {}

  ngOnInit() {}

  /**
   * 打开查看窗口
   * @param params
   * @returns {any}
   */
  open(params: any): Observable<any> {
    this.params = params;
    this.initItems(params.multiOrgs);
    this.modal.open();

    window.sessionStorage.setItem('orgs', JSON.stringify(params.multiOrgs));

    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  onCancel() {
    this.close({
      action: 'cancel',
    });
  }

  onSelect(
    appId,
    orgType,
    registerType,
    factorAppId,
    agencyType,
    recordInfo,
    modelId?
  ) {
    if (!!recordInfo.cacheKey) {
      this.close({
        action: 'yes',
        step: recordInfo.status,
        memo: recordInfo.memo ? recordInfo.memo : '',
        cacheKey: recordInfo.cacheKey,
        appId,
        registerType,
      });
    } else if (
      !!recordInfo.mustReadProtocol &&
      recordInfo.mustReadProtocol === true
    ) {
      this.close({
        action: 'read',
        appId,
        orgType,
        registerType,
        factorAppId: factorAppId || '',
        agencyType: agencyType || 0,
        modelId,
      });
    } else {
      this.close({
        action: 'ok',
        appId,
        orgType,
        registerType,
        factorAppId: factorAppId || '',
        agencyType: agencyType || 0,
        modelId,
      });
    }
  }

  private initItems(multiOrgs: any) {
    const list = [].concat(multiOrgs).sort(this.sortByAppIdDesc);
    this.items = list.map((item, index) => {
      const orgType = this.getOrgType(item.orgType);
      let org = '';
      if (item.orgType === 102) {
        org = `（${item.factorAppName}-${AgencyType[item.agencyType]}）`;
      } else {
        org = this.isMulti(list, item) && orgType ? `（${orgType}）` : '';
      }
      // const org =
      //     this.isMulti(list, item) && orgType ? `（${orgType}）` : '';
      const includesAgileMode =
        item.orgType !== EnterpriseMenuEnum.PLATFORM &&
        item.loginModelList &&
        item.loginModelList.some((x: any) => x.modelId === BusinessMode.Yjl);

      const agileMode = includesAgileMode ? item.loginModelList : undefined;

      if (
        !item.modelId &&
        item.orgType === EnterpriseMenuEnum.FACTORING &&
        item.orgName === FactoringEnum.NewAgile
      ) {
        // 若是 深圳市星顺商业保理有限公司 则设置其为雅居乐-星顺模式
        item.modelId = BusinessMode.Yjl;
      }
      // console.log(JSON.stringify({ agileMode, ...item, orgName: `${item.orgName}${org}` }))
      return { agileMode, ...item, orgName: `${item.orgName}${org}` };
    });
  }

  private sortByAppIdDesc(a, b) {
    return a.appId - b.appId;
  }

  private isMulti(arr: Array<any>, item) {
    return arr.filter((x) => x.appId === item.appId).length > 1;
  }

  private getOrgType(type) {
    switch (type) {
      case 1:
        return '供应商';
      case 2:
        return '核心企业';
      case 3:
        return '保理公司';
      case 4:
        return '银行';
      case 5:
        return '下游采购商';
      case 6:
        return '服务机构';
      case 99:
        return '平台';
      case 102:
        return '中介机构';
      case 201:
        return '核心企业【项目公司】';
      case 202:
        return '核心企业【集团公司】';
      default:
        return '';
    }
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}

export enum AgencyType {
  '计划管理人' = 1,
  '会计师事务所' = 2,
  '联合销售机构' = 3,
  '评级机构' = 4,
  '律师事务所' = 5,
  '主要销售机构' = 6,
  '资产服务机构' = 7,
  '投资者' = 8,
  '托管服务机构' = 9,
  '资金服务机构' = 10,
  '再保理银行' = 11,
  '担保机构' = 12,
  '加入债务人' = 13,
  '差额补足方' = 14,
  '连带责任担保方' = 15,
  '流动性支持方' = 16,
}
