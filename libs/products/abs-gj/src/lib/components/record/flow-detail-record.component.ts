/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\record\flow-detail-record.component.ts
 * @summary：flow-detail-record.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  DragonFinancingContractModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import {
  NewVankeAuditStandardModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/audit-standard-modal.component';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {
  DragonPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { BuildXmlModalComponent } from '../../../../../../shared/src/lib/public/modal/build-xml-modal.component';
import { MapAddModalComponent } from '../../../../../../shared/src/lib/public/modal/map-add-modal.component';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { OperateType, OrgTypeEnum } from 'libs/shared/src/lib/config/enum/common-enum';

@Component({
  selector: 'lib-flow-detail-record-gj',
  templateUrl: './flow-detail-record.component.html',
  styles: [
    `
      .box-body {
        font-size: 12px;
        padding-bottom: 20px;
      }

      .this-log {
        border: 1px solid #ddd;
        font-size: 13px;
        padding: 10px 0;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: #eee;
      }

      .this-log-seq {
        float: left;
        width: 60px;
        text-align: center;
        font-size: 18px;
        color: #00b9a3;
      }

      .this-seq {
        margin-right: 0;
        color: #00b9a3;
        border: 2px solid #00b9a3;
      }

      .this-log-line {
        overflow: hidden;
        line-height: 24px;
      }

      .this-operator-name {
        color: #ff5500;
      }

      .this-operator-action {
        color: #00b9a3;
      }

      .no-top {
        border: 0;
        margin-bottom: 0;
      }
    `,
  ],
})
export class GjFlowDetailRecordComponent implements OnInit {
  @Input() params: any;
  @Input() mainFlowId: string;

  public showBuildBtn = false;
  public showAddBtn = false;
  public showMapBtn = false;

  public steped = 0;
  public proxy = 0;
  public data: Array<number>; // 图片数组
  public showAll = true;
  // 供应商操作的保存日志
  public supplierOperateAppId: any;

  constructor(
    public xn: XnService,
    private vcr: ViewContainerRef,
    private loading: LoadingService
  ) {}

  ngOnInit() {

    this.steped = parseInt(this.params.status, 10);
    this.proxy = parseInt(this.params.isProxy, 10);
    this.showBuildBtn = this.xn.user.orgType === OrgTypeEnum.FACTORING;
    this.showMapBtn = this.xn.user.orgType === OrgTypeEnum.PLATFORM; // 平台

    // 数字资产补录条件： 必须是保理商，必须状态大于5， 必须是复核。
    this.showAddBtn =
      this.xn.user.orgType === OrgTypeEnum.FACTORING &&
      this.steped >= 5 &&
      this.xn.user.roles.indexOf('reviewer') >= 0;
    for (const row of this.params.logs) {
      row.contracts = this.calcContract(row.contracts);
      row.operatorDesc = this.calcOperatorDesc(row);
    }
    if (
      this.params &&
      this.params.billRegister &&
      this.params.billRegister.length > 0
    ) {
      this.params.billRegister = XnUtils.distinctArray(
        this.params.billRegister
      );
      this.params.billRegister = this.params.billRegister.filter((v) => {
        return v !== '';
      });
    }

    // 过滤所有供应商的操作日志, 登陆企业为供应商时
    if (this.xn.user.orgType === OrgTypeEnum.SUPPLIER) {
      this.supplierAppIdSet();
    }
  }

  /**
   *  重新签署问题合同
   * @param paramCons any
   */
  public againSign(paramCons: any): void {
    const contract = paramCons;
    if (contract.length === 0) {
      return this.xn.msgBox.open(false, '未找到需要补充签署的合同');
    }

    contract.forEach((element) => {
      if (!element.config) {
        element.config = {
          text: '',
        };
      }
    });
    contract.forEach((x) => {
      if (x.label.includes('国内无追索权商业保理合同')) {
        x.config.text = '甲方（债权人、出让人）数字签名';
      } else if (
        x.label.includes('应收账款转让协议书') ||
        x.label.includes('应收账款转让登记协议')
      ) {
        x.config.text = '甲方（出让方）';
      } else if (x.label.includes('应收账款债权转让通知书')) {
        x.config.text = '卖方：';
      } else if (x.label === '保理合同-国寿') {
        x.config.text = '卖方（盖章）：';
      } else if (x.label.includes('邮储')) {
        x.config.text = '卖方： （公章）';
      } else if (x.label.includes('农行')) {
        x.config.text = '卖 方 ： （  公 章 （ 含 电 子 章 ））';
      } else {
        x.config.text = '（盖章）';
      }
    });
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonFinancingContractModalComponent,
      contract
    ).subscribe(() => {});
  }

  /**
   *  判断是否显示可查看流程记录
   * @param paramsRow any
   */
  public normalHasOrCanViewDetail(paramsRow): boolean {
    return (
      paramsRow.appId === this.xn.user.appId &&
      paramsRow.flowId !== 'flowIdIsNotChild' &&
      paramsRow.flowId !== 'zichanchi' &&
      paramsRow.flowId !== 'wait_verification_500' &&
      paramsRow.flowId !== 'verificating_500' &&
      paramsRow.flowId !== 'factoring_sign_500' &&
      paramsRow.flowId !== 'wait_loan_500' &&
      paramsRow.flowId !== 'loaded_500' &&
      paramsRow.flowId !== 'wait_finance_500' &&
      paramsRow.flowId !== 'repayment_500' &&
      paramsRow.flowId !== 'vanke_suspend'
    );
  }

  /**
   *  中介机构判断是否显示可查看流程记录
   * @param paramsRow any
   */
  public intermediaryHasOrCanViewDetail(paramsRow): boolean {
    return (
      this.xn.user.orgType === OrgTypeEnum.AGENCY &&
      paramsRow.flowId !== 'flowIdIsNotChild' &&
      paramsRow.flowId !== 'zichanchi' &&
      paramsRow.flowId !== 'wait_verification_500' &&
      paramsRow.flowId !== 'verificating_500' &&
      paramsRow.flowId !== 'factoring_sign_500' &&
      paramsRow.flowId !== 'wait_loan_500' &&
      paramsRow.flowId !== 'loaded_500' &&
      paramsRow.flowId !== 'repayment_500' &&
      paramsRow.flowId !== 'vanke_suspend'
    );
  }

  /**
   * @param paramsRow 查看审核标准
   */
  public showAuditingstandard(paramsRow): boolean {
    return (
      (paramsRow.appId === this.xn.user.appId || this.xn.user.orgType === OrgTypeEnum.FACTORING) &&
      paramsRow.flowId === 'vanke_platform_verify'
    );
  }

  /** 查看审核标准 */
  viewaduitStandard() {
    this.showAuditStandard();
  }

  showAuditStandard() {
    const contractTemp = JSON.parse(this.params.dealContract);

    const invoiceObj = JSON.parse(this.params.invoice);
    const invoiceArray = [];

    invoiceObj.forEach((invoice) => {
      invoiceArray.push({
        invoiceNum: invoice.invoiceNum,
        invoiceCode: invoice.invoiceCode,
        isHistory:
          !!(invoice.mainFlowIds &&
            this.judgeDataType(invoice.mainFlowIds) &&
            invoice.mainFlowIds.length),
      });
    });

    const params: any = {
      mainFlowId: this.params.mainFlowId,
      invoice: invoiceArray,
      contractJia: contractTemp[0].contractJia || '', // 基础合同甲方名称
      contractYi: contractTemp[0].contractYi || '', // 基础合同乙方名称
      payType: contractTemp[0].payType || '', // 合同类型
      percentOutputValue: contractTemp[0].percentOutputValue || '', // 本次产值金额
      payRate: contractTemp[0].payRate || '', // 付款比例
      contractSignTime: contractTemp[0].contractSignTime || '', // 合同签订时间
    };
    this.xn.dragon
      .post('/list/main/checker_list_box', params)
      .subscribe((x) => {
        if (x.ret === 0 && x.data && x.data.length > 0) {
          const params1 = Object.assign({}, {value: '', checkers: x.data});
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            NewVankeAuditStandardModalComponent,
            params1
          ).subscribe(() => {});
        }
      });
  }

  /**
   *  判断数据类型
   * @param value any
   */
  public judgeDataType(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  /**
   *  查看合同
   * @param paramCurrentContract any
   */
  public showContract(paramCurrentContract: any): void {
    if (!!paramCurrentContract.secret) {
      const param = {
        id: paramCurrentContract.id,
        label: paramCurrentContract.label,
        secret: paramCurrentContract.secret,
        readonly: true,
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonPdfSignModalComponent,
        param
      ).subscribe(() => {});
    } else if (!!paramCurrentContract.fileId) {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonMfilesViewModalComponent,
        [paramCurrentContract]
      ).subscribe(() => {});
    }
  }

  /**
   *  返回
   */
  public onCancel(): void {
    this.xn.user.navigateBack();
  }

  /**
   *  生成xml
   */
  public onBuildXml(): void {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      BuildXmlModalComponent,
      {mainFlowId: this.mainFlowId, isAvenger: false}
    ).subscribe(() => {});
  }

  /**
   *  补录客户地图
   */
  public addMap(): void {
    this.xn.api
      .post('/data/map/get', {
        mainFlowId: this.mainFlowId,
      })
      .subscribe((json) => {
        const obj: any = {} as any; // 做成一个新的对象，带上一个mainFlowId
        let contracts: any = [];
        if (json.data.contractFile) {
          contracts = JSON.parse(json.data.contractFile);
        }

        const companyInfo = json.data.data;
        if (companyInfo.length > 0) {
          contracts = this.getContracts(companyInfo, contracts);
        }

        obj.contractInfo = JSON.stringify(contracts);
        obj.mainFlowId = this.mainFlowId;
        this.openView(obj);
      });
  }

  /**
   * 查看子流程  routerLink="/record/view/{{row.recordId}}"
   * @param paramRow any
   */
  public checkSubprocess(paramRow: any) {
    this.xn.router.navigate([`/abs-gj/record/view/${paramRow.recordId}`]);
  }

  /**
   *  下载附件
   *  供应商：只能下载自己上传的文件和合同；
   *  保理商、核心企业、中介机构：下载本交易ID下所有的文件和合同。
   */
  public download() {
    this.xn.dragon
      .post('/list/main/flow_relate_file', {
        mainFlowId: this.mainFlowId,
        start: 0,
        length: Number.MAX_SAFE_INTEGER,
      })
      .subscribe((x) => {
        if (x.data && x.data.data && x.data.data.length) {
          this.data = x.data.data;
          let files = this.data.map((y) => JSON.parse(y[0]));
          files = XnUtils.uniqueBoth(files);

          const appId = this.xn.user.appId;
          const orgName = this.xn.user.orgName;
          const time = new Date().getTime();
          const filename = appId + '-' + orgName + '-' + time + '.zip';
          this.xn.dragon
            .download('/file/downFile', {
              files,
              mainFlowId: this.mainFlowId,
            })
            .subscribe((v: any) => {
              this.loading.close();
              this.xn.dragon.save(v._body, filename);
            });
        } else {
          this.xn.msgBox.open(false, '无可下载项');
        }
      });
  }

  /**
   *  打开客户地图补充弹框
   * @param paramViewData string
   */
  private openView(paramViewData: string) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      MapAddModalComponent,
      paramViewData
    ).subscribe(() => {});
  }

  /**
   * 格式化合同
   * @param paramCompanyInfo any
   * @param paramContracts any
   */
  private getContracts(paramCompanyInfo, paramContracts) {
    // 时间排序
    paramCompanyInfo.sort((a: any, b: any) => {
      if (a.updateTime > b.updateTime) {
        return 1;
      } else {
        return -1;
      }
    });
    const contractInfoData = paramCompanyInfo.slice(paramContracts.length * -1);

    // 拼接数据
    for (let i = 0; i < paramContracts.length; ++i) {
      paramContracts[i].appName = contractInfoData[i].appName;
      paramContracts[i].orgType = contractInfoData[i].appType;
      const objCity = {} as any;
      const objIndustry = {} as any;
      const commodityType = {} as any;
      objCity.first = contractInfoData[i].orgCityFirst;
      objCity.second = contractInfoData[i].orgCitySecond;
      objIndustry.first = contractInfoData[i].orgIndustryFirst;
      objIndustry.second = contractInfoData[i].orgIndustrySecond;
      paramContracts[i].orgIndustry = JSON.stringify(objIndustry);
      paramContracts[i].orgCity = JSON.stringify(objCity);
      paramContracts[i].commodity = JSON.stringify(commodityType);
    }

    return paramContracts;
  }

  /**
   * 递归解析合同
   * @param paramContract any
   */
  private calcContract(paramContract: any): any {
    if (typeof paramContract === 'string') {
      return this.calcContract(XnUtils.parseObject(paramContract));
    }
    return paramContract;
  }

  /**
   * 找出所有企业类型为供应商的 appId 合集
   */
  private supplierAppIdSet() {
    this.xn.api
      .post('/custom/vanke_v5/app/get_app', {orgName: this.xn.user.orgName})
      .subscribe((x) => {
        this.supplierOperateAppId = x.data;
      });
  }

  /**
   *  构建流程提示
   * @param paramRow any
   */
  private calcOperatorDesc(paramRow: any): string {
    if (paramRow.operator === OperateType.PASS) {
      return paramRow.flowId === 'financing'
        ? '申请'
        : paramRow.flowId === 'financing_bank7' &&
        paramRow.memo.indexOf('保理商向供应商退款并背书') >= 0
          ? '拒绝并发起退款'
          : '审核通过';
    } else if (paramRow.operator === OperateType.REJECT) {
      return '退回';
    } else if (paramRow.operator === OperateType.SUSPENSION) {
      return '中止';
    } else {
      return paramRow.operator.toString();
    }
  }

  /**
   *  重新签署问题合同 type:1 为保理主合同，，type：2  应收账款转让协议
   * @param type number
   */
  public againSignCon(type: number): void {
    if (type === 1) {
      this.SignAgain(
        '/re_sign_contract/signMainContract',
        '/re_sign_contract/update'
      );
    } else {
      this.SignAgain('/re_sign_contract/sign', '/re_sign_contract/update');
    }
  }

  SignAgain(firstUrl: string, secondUrl: string) {
    this.xn.api.dragon
      .post(firstUrl, {mainFlowId: this.mainFlowId})
      .subscribe((json) => {
        const contracts = json.data;

        contracts.forEach((x) => {
          if (!x.config) {
            x.config = {text: ''};
          }

          if (x.label.includes('应收账款转让协议书')) {
            x.config.text = '甲方（出让方）';
          } else {
            x.config.text = '（盖章）';
          }
        });
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          DragonFinancingContractModalComponent,
          contracts
        ).subscribe((x) => {
          this.xn.loading.open();
          // 更新添加到库
          if (x === 'ok') {
            // 上一步接口返回数据，原样传递回去
            const p = json.data;
            this.xn.api.dragon
              .post(secondUrl, {mainFlowId: this.mainFlowId, contracts: p})
              .subscribe(() => {});
          }
          this.xn.loading.close();
        });
      });
  }
}
