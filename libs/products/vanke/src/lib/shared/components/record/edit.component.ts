/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：edit.component.ts
 * @summary：流程信息编辑页
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import {
  Component,
  AfterViewInit,
  Output,
  EventEmitter,
  AfterViewChecked,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Params, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
import { OperateType } from 'libs/shared/src/lib/config/enum/common-enum';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { PointService } from 'libs/shared/src/lib/services/point.service';
class CheckerDatas {
  mainFlowId = '';
  recordId = '';
  procedureId = '';
  memo = '';
  flowId = '';
  appType = '';
  checkerData = '';
}

@Component({
  templateUrl: './edit.component.html',
  styles: [
    `
      .box-title {
        font-size: 14px;
      }

      .xn-panel-sm {
        margin-bottom: 10px;
      }

      .xn-panel-sm .panel-heading {
        padding: 5px 15px;
      }

      .xn-panel-sm .panel-heading .panel-title {
        font-size: 14px;
      }

      .panel-footer .btn + .btn {
        margin-left: 10px;
      }

      .app-flow-process {
        border: 1px solid #ddd;
        padding: 4px;
        margin-bottom: 10px;
        border-radius: 3px;
        background-color: #fff;
      }
      .helpUl li {
        text-align: left;
      }
      .rejectClass {
        position: absolute;
        top: 25%;
        left: 80%;
      }
      .changesClass {
        position: absolute;
        top: 28%;
        left: 80%;
      }
      .xn-divide-line {
        background-color: #d7d1d1;
        margin-top: -15px;
        margin-bottom: 15px;
      }
    `,
  ],
})
export class VankeEditComponent
  implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy
{
  @ViewChild('accountDistannce') accountDistannce: ElementRef;
  @ViewChild('cancelModal') cancelModal: ModalComponent;
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
  public recordId: string;

  public svrConfig: any;
  public cancelChecker: any = {
    name: 'cancelChecker',
    type: 'textarea',
    required: false,
  };

  public mainForm: FormGroup;

  public pageTitle = '处理流程记录';
  public pageDesc = '';

  public flowCustom: IFlowCustom;
  public flowId = '';

  public baseInfo: any[] = [];
  public shows: any[] = [];
  public hasActions: boolean;
  public loadingback = false;
  public newSvrConfig: any;
  public mainFlowId: string;
  public rejectdata: string[] = [];
  public updatedata: CheckerDatas[] = [];
  fromModule = 'dragon-input';
  isshowProgress: boolean; // 是否显示导航进度条
  Showintelligence = false;
  public changesInterval: any = null; // 定时任务

  // public isShow: boolean = false;

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService,
    private localStorageService: LocalStorageService,
    public pointService: PointService
  ) {}

  ngAfterViewInit() {}

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.mainFlowId =
      (this.svrConfig &&
        this.svrConfig.record &&
        this.svrConfig.record.mainFlowId) ||
      '';
    this.updatedata = [new CheckerDatas(), new CheckerDatas()];
    this.route.params.subscribe((params: Params) => {
      this.recordId = params.id;
      this.showSubmit(this.recordId);
    });
  }

  ngOnDestroy(): void {}

  /**
   *  拉取后台配置信息
   * @param recordId 流程记录id
   * @param fresh 可选，true的时候则刷新，不拉取actions的最后一项，拉checker
   */
  private showSubmit(recordId, fresh?) {
    //
    this.xn.dragon
      .post('/flow/showSubmit', {
        recordId,
      })
      .subscribe((json) => {
        this.svrConfig = json.data;
        this.flowId = this.svrConfig.flow.flowId;
        this.isshowProgress = this.flowId.startsWith('sub');
        this.flowCustom = FlowCustom.build(
          this.flowId,
          this.xn,
          this.vcr,
          this.loading,
          this.communicateService,
          this.localStorageService,
          this.pointService
        );
        if (!this.svrConfig.isStep) {
          this.flowCustom.postGetSvrConfig(this.svrConfig);
        }
        this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
        this.flowCustom.preShow(this.svrConfig);
        this.mainFlowId =
          this.svrConfig.record.mainFlowId === ''
            ? '1'
            : this.svrConfig.record.mainFlowId;
        const isfresh = this.svrConfig.checkers.filter(
          (x: any) => x.checkerId === 'desc'
        );
        if (isfresh.length !== 0) {
          this.buildRows(true);
        } else {
          this.buildRows(fresh);
        }
        // 拷贝对象
        // this.intelligenceShow();
      });
  }
  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   * @param fresh
   */
  private buildRows(fresh?): void {
    this.baseInfo.push({
      type: 'text',
      title: '流程记录ID',
      data: this.svrConfig.record.recordId,
    });

    if (!XnUtils.isEmpty(this.svrConfig.record.bcOrderId)) {
      this.baseInfo.push({
        type: 'text',
        title: '区块链账本ID',
        data: this.svrConfig.record.bcLedgerId,
      });
      this.baseInfo.push({
        type: 'text',
        title: '区块链记录ID',
        data: this.svrConfig.record.bcOrderId,
      });
    }
    this.shows = [];
    const hides = [this.cancelChecker];

    if (this.svrConfig.procedure.procedureId === '@begin') {
      // 起始步骤要处理下标题
      const titleConfig = this.flowCustom.getTitleConfig();
      const titleObj = {
        name: 'title',
        required: true,
        type: 'text',
        title: (titleConfig && titleConfig.titleName) || '流程标题',
        value:
          this.svrConfig.record.title || (titleConfig && titleConfig.def) || '',
      };

      if (!!titleConfig && titleConfig.hideTitle) {
        hides.push(titleObj);
        this.shows = [].concat(this.svrConfig.checkers);
      } else {
        this.shows = [titleObj].concat(this.svrConfig.checkers);
      }
    } else {
      this.shows = [].concat(this.svrConfig.checkers);
    }

    if (this.svrConfig.rejectType === 0) {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '备注',
        other: '',
      });
    } else {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '审核意见',
        other: '',
      });
    }
    this.copyDraft(this.shows, hides, fresh);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);
    this.afterBuildFormGroup.emit();
  }

  /**
   *  回退上一步，在历史记录中取到最近一次的提交值，即为草稿
   * @param shows
   * @param hides
   * @param fresh
   */
  private copyDraft(shows: any[], hides: any[], fresh: boolean): void {
    // 如果有草稿，就把草稿内容复制过来
    for (const action of this.svrConfig.actions.slice(
      0,
      fresh ? this.svrConfig.actions.length - 1 : this.svrConfig.actions.length
    )) {
      if (
        action.operator === 0 &&
        action.procedureId === this.svrConfig.procedure.procedureId
      ) {
        // 是草稿
        for (const checker of action.checkers) {
          if (checker.type === 'sms' || checker.type === 'password') {
            // sms/password字段不保留草稿
            continue;
          }

          let find = false;
          for (const item of shows) {
            if (
              item.checkerId === 'preInvoiceNum' &&
              item.checkerId === checker.checkerId
            ) {
              item.value = checker.data;
              find = true;
              break;
            } else {
              if (item.checkerId === checker.checkerId && !!!item.value) {
                item.value = checker.data;
                find = true;
                break;
              }
            }
          }
          if (find) {
            continue;
          }
          for (const item of hides) {
            if (item.checkerId === checker.checkerId) {
              item.value = checker.data;
              find = true;
              break;
            }
          }
        }

        // memo字段
        for (const item of shows) {
          if (item.name === 'memo') {
            item.value = action.memo;
            break;
          }
        }
      } else {
        this.hasActions = true;
      }
    }
    // memo字段赋值-万科数据对接 平台审核
    if (
      ['vanke_platform_verify', 'dragon_platform_verify'].includes(
        this.svrConfig.flow.flowId
      ) &&
      ['operate', '@begin'].includes(this.svrConfig.procedure.procedureId)
    ) {
      for (const item of shows) {
        if (item.name === 'memo' && !!this.svrConfig.memo) {
          item.value = this.svrConfig.memo;
          break;
        }
      }
    }
  }
}
