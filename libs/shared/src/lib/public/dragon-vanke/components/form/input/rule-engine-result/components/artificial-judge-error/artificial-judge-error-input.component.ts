
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\rule-engine-result\components\artificial-judge-error\artificial-judge-error-input.component.ts
* @summary：规则引擎人工判断规则异常组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-07
***************************************************************************/

import { Component, OnInit, Input, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'xn-rule-engine-error-artifical-input',
  templateUrl: './artificial-judge-error-input.component.html',
  styles: [
    `
    .rule-index {
      font-size: 16px;
    }

    .rule-index span {
      margin-left: 10px;
      font-weight: bold;
      font-size: 17px;
    }

    .rule-clump {
      font-size: 16px;
    }

    .rule-clump span {
      margin-left: 10px;
      font-weight: bold;
      font-size: 17px;
    }
    ::ng-deep .cdk-overlay-container {
      z-index: 2000;
    }
    .action-btn {
      margin-right: 5px;
    }
    ::ng-deep .ant-alert-warning {
      background-color: #facd91;
    }
    ::ng-deep .ant-alert-warning > td {
      background-color: #facd91;
    }
    ::ng-deep .ant-alert-warning:hover > td {
      background-color: #facd91 !important;
    }
    ::ng-deep .ant-table-tbody > tr.ant-table-row:hover > td {
      background-color: #f5f5f5;
    }
    `
  ]
})
@DynamicForm({ type: 'rule-engine-error-manager', formModule: 'dragon-input' })
export class XnRuleEngineErrorManagerInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  // 表头
  public headsColumns: Column[] = [
    { title: '选择', index: 'id', width: 50, fixed: 'left', type: 'checkbox', },
    {
      title: '序号', index: 'no', format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(), width: 60
    },
    { title: '合同类型/款项性质', index: 'fileNatureChildOptionName', width: 180, },
    { title: '标记类别', index: 'fileClassifyName', width: 180, },
    { title: '人工审核标准', index: 'standardNameList', render: 'StandardTpl', width: 200 },
    { title: '操作', index: 'action', fixed: 'right', render: 'ActionTpl', width: 100 },
  ];
  // 人工审核文件类型及审核标准数据
  public standardErrorList: any[] = [];
  // 选中项
  selectedItems: any[] = [] as any;
  // 选中的文件类型
  fileTypeId: string = '';
  get readonly() {
    return this.row.options.readonly
  }
  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
  ) { }
  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.readonly) {
      this.headsColumns.shift();
    }
    if (this.row.value) {
      const manualReview = JSON.parse(this.row.value);
      XnUtils.jsonToHump(manualReview)
      const fileTypeList = XnUtils.distinctArray(manualReview.map(standard => standard.fileTypeId));
      // 依据文件类型 fileTypeId将人工审核标准数据分类
      this.standardErrorList = fileTypeList.map(fileType => {
        const standardList = manualReview.filter(standard => standard.fileTypeId === fileType);
        return {
          fileTypeId: fileType,
          fileTypeName: standardList[0]['fileTypeName'],
          standardList,
        }
      })
    } else {
      this.standardErrorList = []
    }
  }

  /**
   * 补充说明
   * @param record 数据源
   * @param item 审核标准
   * @param standIndex 当前审核文件类别下标
   * @param index 当前标记类别下标
   * @param i 当前审核标准下标
   */
  uploadApprovalForm(record: TableData, item: any, standIndex: number, index: number, i: number) {
    const checkers = [
      {
        title: '补充说明文件',
        checkerId: 'approvalForm',
        type: 'dragonMfile',
        required: 0,
        options: { filename: "补充说明", fileext: "jpg, jpeg, png,pdf", picSize: "500" },
        value: item.file ? item.file : '',
      }
    ];
    const params = {
      checker: checkers,
      title: '上传补充说明文件',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          item.file = v.approvalForm;
          this.standardErrorList[standIndex]['standardList'][index]['standardNameList'][i]['file'] = v.approvalForm;
          // const addFile = record['standardNameList'].every((standard: any) => (standard.file || standard.userRemark));
          // item._rowClassName = addFile ? '' : 'ant-alert-warning';
          record._rowClassName = this.rowClassName(record);
          this.cdr.markForCheck();
          this.toValue();
        } else {
          this.toValue()
        }
      });
  }

  /**
   * 添加备注
   * @param record 数据源
   * @param item 规则信息
   * @param standIndex 当前审核文件类别下标
   * @param i 当前规则集下标
   * @param index 当前规则下标
   */
  addMark(record: TableData, item: any, standIndex: number, index: number, i: number) {
    const checkers = [
      {
        title: '备注',
        checkerId: 'userRemark',
        type: 'text-area',
        required: 0,
        options: { readonly: false, inputMaxLength: 255 },
        value: '',
      }
    ];
    const params = {
      checker: checkers,
      title: '添加备注',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          item.userRemark = v.userRemark;
          this.standardErrorList[standIndex]['standardList'][index]['standardNameList'][i]['userRemark'] = v.userRemark;
          record._rowClassName = this.rowClassName(record);
          this.cdr.detectChanges()
          this.toValue()
        } else {
          this.toValue()
        }
      });
  }

  /**
   * 修改备注
   * @param record 数据源
   * @param item 规则信息
   * @param standIndex 当前审核文件类别下标
   * @param i 当前规则集下标
   * @param index 当前规则下标
   */
  editMark(record: TableData, item: any, standIndex: number, index: number, i: number) {
    const checkers = [
      {
        title: '备注',
        checkerId: 'userRemark',
        type: 'text-area',
        required: 0,
        options: { readonly: false, inputMaxLength: 255 },
        value: item.userRemark,
      }
    ];
    const params = {
      checker: checkers,
      title: '添加备注',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          item.userRemark = v.userRemark;
          this.standardErrorList[standIndex]['standardList'][index]['standardNameList'][i]['userRemark'] = v.userRemark;
          record._rowClassName = this.rowClassName(record);
          this.cdr.detectChanges()
          this.toValue()
        } else {
          this.toValue()
        }
      });
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onView(paramFile: any) {
    let fileList = JSON.parse(paramFile)
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      fileList
    ).subscribe(() => { });
  }

  /**
   * 赋值
   */
  toValue() {
    let manualReview: any[] = [];
    this.standardErrorList.map(standrd => {
      standrd.standardList.map(rule => {
        manualReview.push(rule)
      })
    });
    XnUtils.jsonToUnderline(manualReview);
    manualReview.forEach((standrd: any) => {
      standrd.standardNameList = standrd.standard_name_list;
      delete standrd.standard_name_list;
    });
    this.ctrl.setValue(JSON.stringify(manualReview));
  }

  /**
     * table事件处理
     * @param e 表格事件
     * @param rsCode 审核标准文件类别
     */
  handleTableChange(e: TableChange, fileTypeId: string) {
    switch (e.type) {
      case 'checkbox': ;
        this.selectedItems = e.checkbox || [];
        this.fileTypeId = fileTypeId;
        break;
      default:
        break;
    }
  }

  /**
  * 批量补充说明
  * @param e Event
  */
  batchUploadFile(e: Event) {
    e.preventDefault();
    const checkers = [
      {
        title: '补充说明',
        checkerId: 'approvalForm',
        type: 'dragonMfile',
        required: 0,
        options: { filename: "", fileext: "jpg, jpeg, png,pdf", picSize: "500" },
        value: '',
      }
    ];
    const params = {
      checker: checkers,
      title: '批量补充说明',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          // 将批量上传的文件设置到勾选的规则中
          this.standardErrorList.map(st => {
            if (st.fileTypeId === this.fileTypeId) {
              st.standardList.map((standard: any) => {
                this.selectedItems.map((item: any) => {
                  if (standard.id === item.id) {
                    item.standardNameList.map((t: any) => {
                      t.file =
                        t.file ? XnUtils.mergeJsonArry(t.file, v.approvalForm) : v.approvalForm;
                    });
                    standard.standardNameList.map((t: any) => {
                      t.file =
                        t.file ? XnUtils.mergeJsonArry(t.file, v.approvalForm) : v.approvalForm;
                    });
                    item._rowClassName = this.rowClassName(item);
                  }
                })
              })
            }
          })
          this.cdr.markForCheck()
          this.toValue()
        } else {
          this.toValue()
        }
      })
  }

  /**
   * 批量添加备注
   * @param e Event
   */
  batchAddMark(e: Event) {
    e.preventDefault();
    const checkers = [
      {
        title: '备注',
        checkerId: 'userRemark',
        type: 'text-area',
        required: 0,
        options: { readonly: false, inputMaxLength: 255 },
        value: '',
      }
    ];
    const params = {
      checker: checkers,
      title: '批量添加备注',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          // 将批量补充的备注设置到勾选的审核标准中
          this.standardErrorList.map(st => {
            if (st.fileTypeId === this.fileTypeId) {
              st.standardList.map(standard => {
                this.selectedItems.map(item => {
                  if (standard.id === item.id) {
                    item.standardNameList.map(t => t.userRemark = v.userRemark);
                    standard.standardNameList.map(t => t.userRemark = v.userRemark);
                    item._rowClassName = this.rowClassName(item);
                  }
                })
              })
            }
          })
          this.cdr.markForCheck()
          this.toValue()
        } else {
          this.toValue()
        }
      });
  }

  /**
   * 表格行的类名
   * @param record 数据源
   * @param index 下标
   */
  rowClassName = (record: TableData) => {
    const addFile = record['standardNameList'].every((standard: any) => (standard.file || standard.userRemark));
    return addFile ? '' : 'ant-alert-warning'
  };
}
