/*
 * @Description: 
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-11-14 18:06:09
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-12-04 11:53:48
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\pages\batch-add-info\batch-add-info.component.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import BatchAddInfoConfig from 'libs/products/bank-shanghai/src/lib/logic/batch-add-info';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';

@Component({
  selector: 'lib-batch-add-info',
  templateUrl: './batch-add-info.component.html',
  styleUrls: ['./batch-add-info.component.css']
})
export class BatchAddInfoComponent implements OnInit, AfterViewInit {
  formModule = 'dragon-input';  // 表单模块
  mainForm: FormGroup;  // 表单类
  svrConfig: any;  // 流程配置项
  rows: any[] = [];  // 控件配置项
  queryParams: any; // 路由数据
  batchList: any[] = [];  // 勾选列表
  constructor(private xn: XnService, private vcr: ViewContainerRef, private cdr: ChangeDetectorRef, private router: ActivatedRoute,
              private localStorageService: LocalStorageService, private er: ElementRef, public hwModeService: HwModeService ) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.queryParams = { ...params };
    });
    if (this.localStorageService.caCheMap.get('batchList')) {
      this.batchList = JSON.parse(this.localStorageService.caCheMap.get('batchList')).batchList;
    }
    console.log('queryParams==', this.queryParams, this.batchList);
    this.doShow();
  }

  /**
   * 在ngAfterViewInit里打开模态框，实际体验效果会好些
   */
  ngAfterViewInit() {
  }

  /**
   *  根据配置渲染form
   */
  private doShow() {
    const config = BatchAddInfoConfig.setValue({ batchInfoShanghai: this.batchList });
    this.svrConfig = XnFlowUtils.handleSvrConfig(config);
    this.buildRows();
  }


  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(): void {
    this.rows = this.svrConfig.checkers;
    this.mainForm = XnFormUtils.buildFormGroup(this.rows);
  }


  /**
   *  提交
   */
  public onSubmit() {
    const formValue: any = this.mainForm.value;
    const param = {
      mainFlowIdList: this.batchList.map((x: any) => x.mainFlowId),
      factoringEndDate: (new Date(formValue.factoringEndDate)).getTime()
    };
    this.xn.dragon.post('/sub_system/sh_vanke_system/factoring_end_date_modify', param).subscribe(x => {
      if (x && x.ret === 0) {
        this.onCancel();
      }
    });
  }


  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.router.navigate(['/bank-shanghai/account-list']);
  }

}
