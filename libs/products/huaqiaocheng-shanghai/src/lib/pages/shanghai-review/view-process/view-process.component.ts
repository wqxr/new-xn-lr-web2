/*
 * @Description: 上海银行复核流程-查看
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-10-23 15:07:03
 * @LastEditors: yutianbao
 * @LastEditTime: 2021-09-27 17:48:06
 * @FilePath: \xn-lr-web2\libs\products\huaqiaocheng-shanghai\src\lib\pages\shanghai-review\view-process\view-process.component.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AntResultModalComponent } from 'libs/products/bank-shanghai/src/lib/share/components/result-modal/ant-result-modal.component';
import { ShowModalService } from 'libs/products/bank-shanghai/src/lib/share/services/show-modal.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'oct-view-process',
  templateUrl: './view-process.component.html',
  styleUrls: ['./view-process.component.css']
})
export class OctViewProcessComponent implements OnInit, AfterViewInit {
  formModule = 'dragon-show';  // 表单模块
  mainForm: FormGroup;  // 表单类
  svrConfig: any;  // 流程配置项
  rows: any[] = [
    {
      fieldGroupSpan: 24,
      key: 'accessInfo',
      text: '准入资料',
      fieldGroup: []
    },
    {
      fieldGroupSpan: 24,
      key: 'businessInfo',
      text: '业务资料',
      fieldGroup: []
    },
    {
      fieldGroupClassName: 24,
      key: 'addLoanCrdNo',
      text: '补充中征码',
      fieldGroup: []
    },
  ];  // 控件配置项
  queryParams: any; // 路由数据
  showProgress = true;
  nzLayout: 'horizontal' | 'vertical' = 'vertical';
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private showModalService: ShowModalService,
    private route: ActivatedRoute,
    private router: Router,
    private er: ElementRef,
    public hwModeService: HwModeService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.queryParams = { ...params };
      this.doShow();
    });
  }

  ngAfterViewInit() {
  }

  /**
   *  根据配置渲染form
   */
  private doShow() {
    const postObj = {
      recordId: this.queryParams.recordId, // 'RE010817600_111568_QM3Q4O'
    };
    this.xn.api.dragon.postMapCatch('/record/record/view', postObj).subscribe({
      next: (json: any) => {
        if (json && json.ret !== 0) {
          this.showPostError(json);
        } else if (json && json.ret === 0 && json.data) {
          const currentObj = json.data.actions.find((x: any) => x.recordSeq.toString() === json.data.record.recordSeq.toString()) || null;
          this.svrConfig = {
            ...json.data,
            checkers: currentObj && currentObj.checkers ? currentObj.checkers : []
          };
          // this.flowCustom.postGetSvrConfig(this.svrConfig);
          this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
          // this.buildRows();
          this.prevHandleSvrConfig(this.svrConfig);
        }
      },
      error: (err: any) => {
        console.log('err', err);
      },
      complete: () => {
      }
    });
  }

  /**
   * 接口返回数据预处理
   * @svrConfig 接口返回数据
   */
  prevHandleSvrConfig(svrConfig: any) {
    // const checkersObj = this.svrConfig.actions.find((x: any) => x.recordSeq === this.svrConfig.record.recordSeq);
    const checkers = svrConfig?.checkers || [];
    // 重新组装数据 添加样式
    const checkersNew = [
      {
        fieldGroupSpan: 24,
        key: 'accessInfo',
        text: '准入资料',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: ['supplierName', 'linkageRadio'],
            checkerGroup: checkers.filter((x: any) => ['supplierName', 'linkageRadio']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = ['linkageRadio'].includes(y.checkerId) ? 16 : 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['creditPublicityFile', 'enterpriseExecutorFile', 'litigationFile'],
            checkerGroup: checkers.filter((x: any) => ['creditPublicityFile', 'enterpriseExecutorFile', 'litigationFile']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['baseFile'],
            checkerGroup: checkers.filter((x: any) => ['baseFile'].includes(x.checkerId)).map((y: any) => {
              y.checkerSpan = ['baseFile'].includes(y.checkerId) ? 18 : 8;
              return y;
            })
          },
        ]
      },
      {
        fieldGroupSpan: 24,
        key: 'businessInfo',
        text: '业务资料',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: ['productType', 'headquarters', 'projectCompany'],
            checkerGroup: checkers.filter((x: any) => ['productType', 'headquarters', 'projectCompany']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['supplierName', 'receive', 'discountRate'],
            checkerGroup: checkers.filter((x: any) => ['supplierName', 'receive', 'discountRate']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['registerCertFile', 'otherFile'],  // 'checkCertFile',
            checkerGroup: checkers.filter((x: any) => ['registerCertFile', 'otherFile']  // 'checkCertFile',
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['dealContract'],
            checkerGroup: checkers.filter((x: any) => ['dealContract']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = ['dealContract'].includes(y.checkerId) ? 24 : 8;
                return y;
              })
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['invoice'],
            checkerGroup: checkers.filter((x: any) => ['invoice']
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = ['invoice'].includes(y.checkerId) ? 24 : 8;
                return y;
              })
          },
        ]
      },
      {
        fieldGroupClassName: 24,
        key: 'addLoanCrdNo',
        text: '融资申请信息',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: [
              'eAccountStatus',
              'eAcctNo',
              'debtUnitUser',
              'debtUnitUserMobile',
              'debtUnitRegisterAddress',
              'debtUnitAddress',
              'projectCompanyName',
              'projectCompanyCustNo',
              'prjAcctBank',
              'prjBankAcctName',
              'prjBankAcctNo',
            ],
            checkerGroup: checkers.filter((x: any) => [
              'eAccountStatus',
              'eAcctNo',
              'debtUnitUser',
              'debtUnitUserMobile',
              'debtUnitRegisterAddress',
              'debtUnitAddress',
              'projectCompanyName',
              'projectCompanyCustNo',
              'prjAcctBank',
              'prjBankAcctName',
              'prjBankAcctNo',
            ]
              .includes(x.checkerId)).map((y: any) => {
                y.checkerSpan = 8;
                return y;
              })
          }
        ]
      },
    ];
    this.buildRows(checkersNew, checkers);
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(checkersNew: any[], checkers: any[]): void {
    // this.rows = this.svrConfig.checkers;
    // this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    this.rows = checkersNew;
    this.mainForm = XnFormUtils.buildFormGroup(checkers);
    this.cdr.markForCheck();
  }

  /**
   * 返回列表
   */
  onGoBack() {
    this.router.navigate(['/oct-shanghai/review-list']);
  }

  showPostError(json: { ret: number, msg: string }) {
    const param = {
      nzTitle: '',
      nzWidth: 480,
      nzFooter: true,
      nzMaskClosable: true,
      nzClosable: true,
      message: {
        nzType: 'close-circle',
        nzColor: '#ff4d4f',
        nzTitle: '错误',
        nzContent: `错误码[${json.ret}]，${json.msg}`,
      },
      buttons: {
        left: [],
        right: [
          { label: '确定', btnKey: 'ok', type: 'normal' }
        ]
      }
    };
    this.showModalService.openModal(this.xn, this.vcr, AntResultModalComponent, param).subscribe((x: any) => {
      if ([99902, 20001].includes(json.ret)) {
        // 用户没有登录，跳转到登录界面
        this.router.navigate(['/login']);
      } else {
        this.onGoBack();
      }
    });
  }

}
