/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：flow-detail-record.component.ts
 * @summary：交易详情
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason               date
 * 1.0                 zhyuanan      对于问题合同进行重新盖章  2019-04-09 10:00
 * 1.1                 zhyuanan      暂时关闭重新签署合同      2019-04-09 18:00
 * 1.2                 zhyuanan      下载附件，包含金地总部公司上传的付款确认书  2019-04-16
 * **********************************************************************
 */

import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { BuildXmlModalComponent } from 'libs/shared/src/lib/public/modal/build-xml-modal.component';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { MapAddModalComponent } from 'libs/shared/src/lib/public/modal/map-add-modal.component';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'xn-flow-detail-record',
  templateUrl: './flow-detail-record.component.html',
  styles: [
    ` 
    .box-body { font-size: 12px; padding-bottom: 20px; }
    .this-title-color { color: #9a9a9a; }
    .this-flex-status {  width: 200px; padding-top: 7px; }
    .detail-status { font-size: 18px; color: #71b247; }
    .this-log { border: 1px solid #ddd; font-size: 13px; padding: 10px 0; border-radius: 5px; margin-bottom: 10px; background-color: #eee; }
    .this-log-seq { float: left; width: 60px; text-align: center; font-size: 18px; color: #00b9a3; }
    .this-seq { margin-right: 0; color: #00b9a3; border: 2px solid #00b9a3; }
    .this-log-line { overflow: hidden; line-height: 24px; }
    .this-operator-name { color: #ff5500; }
    .this-operator-action { color: #00b9a3; }
    .no-top { border: 0; margin-bottom: 0 }
    .blue { color: #3c8dbc; }
    `
  ]
})
export class FlowDetailRecordComponent implements OnInit {

  @Input() params: any;
  @Input() mainFlowId: string;

  public showBuildBtn = false;
  public showAddBtn = false;
  public showMapBtn = false;
  public factorViewPermission = true;

  public steped = 0;
  public proxy = 0;
  public data: Array<number>; // 图片数组

  // 供应商操作的保存日志
  public supplierOperateAppId: any;

  constructor(public xn: XnService, private vcr: ViewContainerRef, private loading: LoadingService, private cdr: ChangeDetectorRef,) {
  }

  ngOnInit() {
    this.steped = parseInt(this.params.status, 10);
    this.proxy = parseInt(this.params.isProxy, 10);
    this.showBuildBtn = this.xn.user.orgType === 3;
    this.showMapBtn = this.xn.user.orgType === 99; // 平台

    // 数字资产补录条件： 必须是保理商，必须状态大于5， 必须是复核。
    this.showAddBtn = this.xn.user.orgType === 3 && this.steped >= 5 && this.xn.user.roles.indexOf('reviewer') >= 0;
    for (const row of this.params.logs) {
      row.contracts = this.calcContract(row.contracts);
      row.operatorDesc = this.calcOperatorDesc(row);
    }
    if (this.params && this.params.billRegister && this.params.billRegister.length > 0) {
      this.params.billRegister = XnUtils.distinctArray(this.params.billRegister);
      this.params.billRegister = this.params.billRegister.filter(v => {
        return v !== '';
      });
    }

    // 过滤所有供应商的操作日志, 登陆企业为供应商时
    if (this.xn.user.orgType === 1) {
      this.supplierAppIdSet();
    }

    let resRoles = this.xn.user.roles.filter(function (item, index, array) {
      return !(item === undefined || item === null || item === '');
    });
    if (this.xn.user.orgType === 3 && resRoles.length === 1 && resRoles[0] === "checkerLimit") {
      this.factorViewPermission = false;
    }
  }

  /**
   *  重新签署问题合同 todo 暂时关闭
   * @param paramCons
   */
  public repSignCons(paramCons: any): void {
    let contract = paramCons;
    if (contract.length === 0) {
      return this.xn.msgBox.open(false, '未找到需要补充签署的合同');
    }
    contract = contract.filter(x => !x.label.includes('国内无追索权商业保理合同'));

    contract.forEach(element => {
      if (!element['config']) {
        element['config'] = {
          text: ''
        };
      }
    });
    contract.forEach(x => {
      if (x.label.includes('国内无追索权商业保理合同')) {
        x['config']['text'] = '甲方（债权人、出让人）数字签名';
      } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
        x['config']['text'] = '甲方（出让方）';
      } else if (x.label.includes('公开型无追索权国内保理合同')) {
        x['config']['text'] = '卖方（盖章）';
      } else if (x.label.includes('应收账款债权转让通知书')) {
        x['config']['text'] = '（公章）';
      } else {
        x['config']['text'] = '（盖章）';
      }
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contract)
      .subscribe(() => {
      });

  }
  /**
 *  重新签署问题合同 todo 暂时关闭
 * @param paramCons
 */
  public againSignCons(paramCons: any): void {
    let contract = paramCons;
    if (contract.length === 0) {
      return this.xn.msgBox.open(false, '未找到需要补充签署的合同');
    }
    contract = contract.filter((x: any) => x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议'));
    contract.forEach(x => {
      if (!('config' in x)) {
        x.config = { text: '' };
      }
      // if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
      //     x['config']['text'] = '甲方（出让方）';
      // } else if (x.label.includes('应收账款转让通知书')) {
      //     x['config']['text'] = '供应商/债权人';
      // } else {
      //     x['config']['text'] = '（盖章）';
      // }
      if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
        x['config']['text'] = '乙方（受让方）';
      } else {
        x['config']['text'] = '（盖章）';
      }
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contract)
      .subscribe(() => {
        this.cdr.markForCheck();
      });

  }

  /**
*  重新签署问题合同 todo 暂时关闭
* @param paramCons
*/
  public againSignCon(appId: string): void {
    if (appId === '103111') {
      this.SignAgain('/custom/jindi_v3/project/once_re_sign', '/custom/jindi_v3/project/update_once_re_sign', appId);
    } else if (appId === HeadquartersTypeEnum[2]) {
      this.SignAgain('/custom/jindi_v3/project/re_sign', '/custom/jindi_v3/project/update_re_sign', appId);
    }
  }

  SignAgain(firstUrl: string, secondUrl: string, appId: string) {
    this.xn.api.post(firstUrl, {}).subscribe(json => {
      //json.data.flowId = 'contract_20200106_29992';
      let contracts = null;
      let params = null;
      if (appId === '103111') {
        contracts = json.data;
        params = { 'contractList': json.data };
      } else {
        contracts = json.data.contractList;
        params = json.data;
      }
      contracts.forEach(element => {
        if (!element['config']) {
          element['config'] = {
            text: ''
          };
        }
      });
      contracts.forEach(x => {
        if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
          x['config']['text'] = '甲方（出让方）';
        } else {
          x['config']['text'] = '（盖章）';
        }
      });
      XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contracts)
        .subscribe((x) => {
          this.xn.loading.open();
          // 更新添加到库
          if (x === 'ok') {
            // 上一步接口返回数据，原样传递回去
            const p = json.data;
            this.xn.api.post(secondUrl, params).subscribe((x) => {
              if (x.ret === 0) {
                this.cdr.markForCheck();
              }
            });
          }
          this.xn.loading.close();
        });

    });

  }

  /**
   *  保理商对于万科供应商重新生成的合同，签署 0425关闭
   * @param paramCons
   */
  public factoringRepSignVankeCons(paramCons: any[]): void {
    const contract = paramCons
      .filter(f => f.label.includes('应收账款转让协议书') || f.label.includes('应收账款转让登记协议'));
    contract.forEach(c => {
      if (!('config' in c)) {
        c.config = { text: '' };
      }
      c['config']['text'] = '乙方（受让方）';
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contract)
      .subscribe();

  }

  /**
   *  万科，供应商重新生成合同，并签署 0425关闭
   * @param paramRow
   */
  public supplierRepSignVankeCons(paramRow: any): void {
    this.xn.api.post('/custom/vanke_v5/contract/add_wanke_contracts',
      { recordId: paramRow.recordId, contracts: paramRow.contracts })
      .subscribe(res => {
        const contract = res.data;
        contract.forEach(c => {
          if (!('config' in c)) {
            c.config = { text: '' };
          }
          c['config']['text'] = '甲方（出让方）';
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contract)
          .subscribe(back => {
            if (back === 'ok') {
              this.xn.api.post('/custom/vanke_v5/contract/update_wanke_contracts',
                { mainFlowId: paramRow.mainFlowId, contracts: contract }).subscribe();
            }
          });
      });
  }

  /**
   *  判断是否显示可查看流程记录
   * @param paramsRow
   */
  public normalHasOrCanViewDetail(paramsRow): boolean {
    return paramsRow.appId === this.xn.user.appId
      && paramsRow.flowId !== 'flowIdIsNotChild'
      && paramsRow.flowId !== 'zichanchi'
      && paramsRow.flowId !== 'wait_verification_500'
      && paramsRow.flowId !== 'verificating_500'
      && paramsRow.flowId !== 'factoring_sign_500'
      && paramsRow.flowId !== 'wait_loan_500'
      && paramsRow.flowId !== 'loaded_500'
      && paramsRow.flowId !== 'repayment_500';
  }

  /**
   *  中介机构判断是否显示可查看流程记录
   * @param paramsRow
   */
  public intermediaryHasOrCanViewDetail(paramsRow): boolean {
    return [77, 102].includes(this.xn.user.orgType)
      && paramsRow.flowId !== 'flowIdIsNotChild'
      && paramsRow.flowId !== 'zichanchi'
      && paramsRow.flowId !== 'wait_verification_500'
      && paramsRow.flowId !== 'verificating_500'
      && paramsRow.flowId !== 'factoring_sign_500'
      && paramsRow.flowId !== 'wait_loan_500'
      && paramsRow.flowId !== 'loaded_500'
      && paramsRow.flowId !== 'repayment_500';
  }

  /**
   *  查看合同
   * @param paramCurrentContract 当前合同数据
   */
  public showContract(paramCurrentContract: any): void {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
      id: paramCurrentContract.id,
      label: paramCurrentContract.label,
      secret: paramCurrentContract.secret,
      readonly: true
    }).subscribe(() => { });
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
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BuildXmlModalComponent, { mainFlowId: this.mainFlowId, isAvenger: false })
      .subscribe(() => {
      });
  }


  /**
   *  补录客户地图
   */
  public addMap(): void {
    this.xn.api.post('/data/map/get', {
      mainFlowId: this.mainFlowId
    }).subscribe(json => {
      const obj: any = {} as any; // 做成一个新的对象，带上一个mainFlowId
      let contracts: any = [];
      if (json.data.contractFile) {
        contracts = JSON.parse(json.data.contractFile);
      }

      const companyInfo = json.data.data;
      if (companyInfo.length > 0) {
        contracts = this.getContracts(companyInfo, contracts);
      }

      obj['contractInfo'] = JSON.stringify(contracts);
      obj['mainFlowId'] = this.mainFlowId;
      this.openView(obj);
    });

  }

  /**
   * 查看子流程  routerLink="/console/record/view/{{row.recordId}}"
   * @param paramRow
   */
  public checkSubprocess(paramRow: any) {
    this.xn.router.navigate([`/console/record/view`],
      { queryParams: { recordId: paramRow.recordId, appId: paramRow.appId } });
  }

  /**
   *  下载附件
   *  供应商：只能下载自己上传的文件和合同；
   *  保理商、核心企业、中介机构：下载本交易ID下所有的文件和合同。
   */
  public download() {
    let files: any = [];
    const procedureIdArr = [];
    if (this.xn.user.orgType === 1) {
      let logsData: any[];
      if (this.params.logs.length) {
        logsData = this.params.logs
          .filter(x => !!x.appId && x.appId === this.supplierOperateAppId.appId);
      }
      for (const action of logsData) {
        if (action.flowId !== '') {
          // 找出所有的流程ID
          if (procedureIdArr.indexOf(action.flowId) === -1) {
            procedureIdArr.push(action.flowId);
          }
        }
      }

      for (const proceId of procedureIdArr) {
        const arr: any = [];
        for (const action of logsData) {
          if (action.flowId === proceId) {
            // 构建一个数组，选出最后一个流程id
            arr.push(action);
          }
        }
        files = this.selectFiles(arr[arr.length - 1], files);
      }
    } else {
      for (const action of this.params.logs) {
        if (action.flowId !== '') {
          // 找出所有的流程ID
          if (procedureIdArr.indexOf(action.flowId) === -1) {
            procedureIdArr.push(action.flowId);
          }
        }
      }
      for (const proceId of procedureIdArr) {
        const arr: any = [];
        for (const action of this.params.logs) {
          if (action.flowId === proceId) {
            // 构建一个数组，选出最后一个流程id
            arr.push(action);
          }
        }
        // 这里是因为保理商收款可能有多个，所以不是取最后一个，而是全部都要
        for (const row of arr) {
          if (row.flowId === 'factoring_repayment') {
            files = this.selectFiles(row, files);
          } else {
            files = this.selectFiles(arr[arr.length - 1], files);
          }
        }
      }
    }
    if (files.length) {
      // 拼接文件名
      let appId = this.xn.user.appId;
      let orgName = this.xn.user.orgName;
      let time = new Date().getTime();
      let filename = appId + '-' + orgName + '-' + time + '.zip';

      XnUtils.checkLoading(this);
      this.xn.api.download('/file/down_file', {
        files: files,
        mainFlowId: this.mainFlowId
      }).subscribe((v: any) => {
        this.loading.close();
        this.xn.api.save(v._body, filename);
      });
    } else {
      this.xn.msgBox.open(false, '无可下载项');
    }

  }

  /**
   *  格式化需要下载的文件
   * @param paramAction
   * @param paramFileArr
   */
  private selectFiles(paramAction, paramFileArr): Array<any> {
    // 所有文件子流程id（不包含保理放款和回款）
    const checkerFile = [];
    // 放款和回款的格式不一样，单独处理
    const checkerMoneyFile = ['factoring_loan', 'factoring_repayment'];
    this.params.logs.map(v => {
      if (v && v.flowId && (v.flowId !== 'factoring_loan' || v.flowId !== 'factoring_repayment')) {
        checkerFile.push(v.flowId);
      }
    });
    // 其他文件信息
    for (const check of checkerFile) {
      if (paramAction && paramAction.flowId && paramAction.flowId === check) {
        const checkers = JSON.parse(paramAction.checkers);
        this.getCheckerFile(checkers, paramFileArr);
      }
    }

    for (const check of checkerMoneyFile) {
      if (paramAction && paramAction.flowId && paramAction.flowId === check) {
        const checkers = JSON.parse(paramAction.checkers);
        this.getMoneyCheckerFile(checkers, paramFileArr);
      }
    }
    // 合同文件
    if (paramAction && paramAction.contracts) {
      for (const contract of paramAction.contracts) {
        paramFileArr.push(contract);
      }
    }
    // 去除重复的文件
    paramFileArr = XnUtils.uniqueBoth(paramFileArr);
    return paramFileArr;
  }

  /**
   *  获取checker项中上传的文件
   * @param checkers 配置编辑页面的checkers
   * @param fileArr  所有文件属性名
   */
  private getCheckerFile(checkers, fileArr): Array<any> {
    // 合同文件
    const contractArr = ['contractFile', 'contractInfo'];
    // 图片，pdf ,excel等格式文件
    const fileArrays = [
      'dockFile',
      'honourFile',
      'invoiceFile',
      'honourInfo',
      'invoiceInfo',
      'checkFile',
      'goodsFile',
      'constitutionFile',
      'certificateFile',
      'supervisorFile',
      'otherFile',
      'performanceFile', // 履约证明
      'proofFile',
      'ZDWFile',
      'qrs',  // 确认书
      'pz',   // 凭证
      'qrsReal',  // 实际确认书
      'paymentFile',  // 付款文件
      'receivableFile', // 应收账款文件
      'cotherFile',
      'supplyInvoice', // 补充发票文件
      'businessLicenseFile', // 营业执照
      'businessLicense',
      'projectLicense', // 项目公司执照
      'projectAuthority',
      'payFile'
    ];
    let process = ['begin', 'operate'];
    for (const contract of contractArr) {
      for (const proce of process) {
        if (checkers && checkers[proce] && checkers[proce][contract]) {
          for (const row of JSON.parse(checkers[proce][contract])) {
            // row.files 可能是{}，[{}]
            if (row.files instanceof Array) {
              for (const file of row.files) {
                file['fileTitle'] = contract;
                fileArr.push(file);
              }
            } else {
              for (const file of row.files.img) {
                file['fileTitle'] = contract;
                fileArr.push(file);
              }
            }
          }
        }
      }
    }

    // 遍历图片
    for (const infile of fileArrays) {
      for (const proce of process) {
        if (checkers && checkers[proce] && checkers[proce][infile]) {
          const tf = JSON.parse(checkers[proce][infile]);
          if (Array.isArray(tf)) {
            for (const file of JSON.parse(checkers[proce][infile])) {
              if (file && file.fileId) {
                file['fileTitle'] = infile;
                fileArr.push(file);
              }
              if (file && file.files) {
                for (const i of file.files.img) {
                  i['fileTitle'] = infile;
                  fileArr.push(i);
                }
              }
            }
          } else {
            if (tf.fileId) {
              tf['fileTitle'] = infile;
              fileArr.push(tf);
            }
          }

        }
      }
    }
    return fileArr;
  }

  /**
   * 放款和回款单独处理
   * @param paramCheckers
   * @param fileArr
   */
  private getMoneyCheckerFile(paramCheckers, fileArr) {
    const process = ['begin', 'operate'];
    for (const proce of process) {
      if (paramCheckers && paramCheckers[proce] && paramCheckers[proce].pic) {
        for (const file of JSON.parse(paramCheckers[proce].pic)) {
          file['fileTitle'] = proce;
          fileArr.push(file);
        }
      }
    }
    return fileArr;
  }

  /**
   *  打开客户地图补充弹框
   * @param paramViewData
   */
  private openView(paramViewData: string) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, MapAddModalComponent, paramViewData)
      .subscribe(() => {
      });
  }

  /**
   * 格式化合同
   * @param paramCompanyInfo
   * @param paramContracts
   */
  private getContracts(paramCompanyInfo, paramContracts) {
    // 时间排序
    paramCompanyInfo.sort(function (a: any, b: any): number {
      if (a.updateTime > b.updateTime) {
        return 1;
      } else {
        return -1;
      }
    });
    const contractInfoData = paramCompanyInfo.slice(paramContracts.length * -1);

    // 拼接数据
    for (let i = 0; i < paramContracts.length; ++i) {
      paramContracts[i]['appName'] = contractInfoData[i]['appName'];
      paramContracts[i]['orgType'] = contractInfoData[i]['appType'];
      const objCity = {} as any;
      const objIndustry = {} as any;
      const commodityType = {} as any;
      objCity['first'] = contractInfoData[i]['orgCityFirst'];
      objCity['second'] = contractInfoData[i]['orgCitySecond'];
      objIndustry['first'] = contractInfoData[i]['orgIndustryFirst'];
      objIndustry['second'] = contractInfoData[i]['orgIndustrySecond'];
      paramContracts[i]['orgIndustry'] = JSON.stringify(objIndustry);
      paramContracts[i]['orgCity'] = JSON.stringify(objCity);
      paramContracts[i]['commodity'] = JSON.stringify(commodityType);
    }

    return paramContracts;
  }

  /**
   * 递归解析合同
   * @param paramContract
   */
  private calcContract(paramContract: any): any {
    if (typeof paramContract === 'string') {
      return this.calcContract(JSON.parse(paramContract));
    }
    return paramContract;
  }

  /**
   * 找出所有企业类型为供应商的 appId 合集
   */
  private supplierAppIdSet() {
    this.xn.api.post('/custom/vanke_v5/app/get_app',
      { orgName: this.xn.user.orgName }).subscribe(x => {
        this.supplierOperateAppId = x.data;
      });
  }

  /**
   *  构建流程提示
   * @param paramRow
   */
  private calcOperatorDesc(paramRow: any): string {
    if (paramRow.operator === 1) {
      return paramRow.flowId === 'financing'
        ? '申请'
        : paramRow.flowId === 'financing_bank7' && paramRow.memo.indexOf('保理商向供应商退款并背书') >= 0
          ? '拒绝并发起退款'
          : '审核通过';
    } else if (paramRow.operator === 2) {
      return '退回';
    } else if (paramRow.operator === 3) {
      return '中止';
    } else {
      return paramRow.operator.toString();
    }
  }
}
