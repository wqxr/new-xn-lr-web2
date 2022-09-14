/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\form\rule-engine-result\components\system-judge-error-input\system-judge-error-input.component.ts
 * @summary：规则引擎系统判断异常组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-09-07
 ***************************************************************************/

import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import {
  FileOperateEnum,
  RuleHandTypeEnum,
  RuleValidTypeEnum,
} from 'libs/shared/src/lib/config/enum';
import { VaildTypeOptions } from 'libs/shared/src/lib/config/options';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'xn-rule-engine-error-sys-input',
  templateUrl: './system-judge-error-input.component.html',
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
      ::ng-deep .ant-tooltip {
        z-index: 1500;
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
    `,
  ],
})
@DynamicForm({ type: 'rule-engine-error-sys', formModule: 'dragon-input' })
export class XnRuleEngineErrorInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  // 表头
  public headsColumns: Column[] = [
    { title: '选择', index: 'id', width: 50, fixed: 'left', type: 'checkbox' },
    {
      title: '序号',
      index: 'no',
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
      width: 50,
    },
    { title: '规则引擎结果', index: 'result', width: 60, render: 'ResultTpl' },
    { title: '异常原因', index: 'speech', render: 'SpeechTpl', width: 400 },
    {
      title: '校验类型',
      index: 'validateType',
      width: 70,
      render: 'VaildTypeTpl',
    },
    { title: '规则名称', index: 'ruleName', render: 'ruleNameTpl', width: 300 },
    { title: '指标内容', index: 'indexList', render: 'indexTpl', width: 300 },
    { title: '规则编号', index: 'ruleCode', width: 80 },
    {
      title: '操作',
      index: 'action',
      fixed: 'right',
      render: 'ActionTpl',
      width: 100,
    },
  ];
  // 选中项
  selectedItems: any[] = [] as any;
  // 节点信息
  public pointInfo: any = {};
  // 规则集信息
  public rsList: any[] = [];
  // 勾选中的规则集编码
  public rsCode: string = '';

  // 校验类型option
  get vaildTypeOptions() {
    return VaildTypeOptions;
  }
  // 校验类型enum
  get ruleValidTypeEnum() {
    return RuleValidTypeEnum;
  }
  // 强提醒处理方式类型enum
  get ruleHandTypeEnum() {
    return RuleHandTypeEnum;
  }
  get readonly() {
    return this.row.options.readonly;
  }
  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private msg: NzMessageService
  ) { }
  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.readonly) {
      this.headsColumns.shift();
    }
    if (this.row.value) {
      const pointInfo = JSON.parse(this.row.value);
      XnUtils.jsonToHump(pointInfo);
      this.pointInfo = XnUtils.deepClone(pointInfo);
      this.rsList = this.pointInfo.rsList;
      window.setTimeout(() => {
        this.rsList[0].ruleList.forEach((item, index) => {
          const elHeight = document.getElementById(
            'setdiv' + index
          ).offsetHeight;
          let times = Math.ceil(Math.max(elHeight / 20));
          if (times > 5) {
            document.getElementById('speechId' + index).style.maxHeight =
              20 * times + 'px';
          } else {
            document.getElementById('speechId' + index).style.maxHeight =
              '100px';
          }
        });
      });
    }
  }

  /**
   * 上传特殊事项审批表
   */
  uploadApprovalForm(item: any, i: number, index: number, operate: string) {
    const checkers = [
      {
        title: '文件',
        checkerId: 'approvalForm',
        type: 'dragonMfile',
        required: 0,
        options: {
          filename: '特殊事项审批表',
          fileext: 'jpg, jpeg, png,pdf',
          picSize: '500',
        },
        value: item.file ? item.file : '',
      },
    ];
    const params = {
      checker: checkers,
      title: FileOperateEnum[operate],
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (v) {
        item.file = v.approvalForm;
        this.rsList[i]['ruleList'][index]['file'] = v.approvalForm;
        // 背景颜色设置
        if (item['validateType'] === RuleValidTypeEnum.STRONG_REMINDER) {
          item._rowClassName = (item.file || item.userRemark) ? '' : 'ant-alert-warning';
        } else {
          item._rowClassName = item.file ? '' : 'ant-alert-warning';
        }
        this.cdr.markForCheck();
        this.toValue();
      } else {
        this.toValue();
      }
    });
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onViewFile(paramFile: any) {
    let fileList = JSON.parse(paramFile);
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      fileList
    ).subscribe(() => { });
  }

  /**
   * 操作按钮
   * @param vaildType 规则校验类型
   * @param ruleValidType
   * @returns
   */
  actionType(vaildType: number, ruleValidType: number) {
    return !this.readonly && vaildType === ruleValidType;
  }

  /**
   * 赋值
   */
  toValue() {
    const fromValue = XnUtils.deepClone(this.pointInfo);
    XnUtils.jsonToUnderline(fromValue);
    this.ctrl.setValue(JSON.stringify(fromValue));
  }

  /**
   * 补充文件
   * @param item 规则信息
   * @param i 当前规则集下标
   * @param index 当前规则下标
   */
  addFile(item: any, i: number, index: number) {
    const checkers = [
      {
        title: '补充文件',
        checkerId: 'approvalForm',
        type: 'dragonMfile',
        required: 0,
        options: {
          filename: '特殊事项审批表',
          fileext: 'jpg, jpeg, png,pdf',
          picSize: '500',
        },
        value: item.file ? item.file : '',
      },
    ];
    const params = {
      checker: checkers,
      title: '上传补充文件',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (v) {
        item.file = v.approvalForm;
        this.rsList[i]['ruleList'][index]['file'] = v.approvalForm;
        // 背景颜色设置
        item._rowClassName = (item.file || item.userRemark) ? '' : 'ant-alert-warning';
        this.cdr.markForCheck();
        this.toValue();
      } else {
        this.toValue();
      }
    });
  }

  /**
   * 备注按钮
   * @param item 规则信息
   * @param handType 强提醒处理方式
   * @returns
   */
  showMark(item: any, handType: string) {
    return (
      !this.readonly &&
      item['validateType'] === RuleValidTypeEnum.STRONG_REMINDER &&
      item['handleType'].split(',').includes(handType)
    );
  }

  /**
   * 添加备注
   * @param item 规则信息
   * @param i 当前规则集下标
   * @param index 当前规则下标
   */
  addMark(item: any, i: number, index: number) {
    const checkers = [
      {
        title: '备注',
        checkerId: 'userRemark',
        type: 'text-area',
        required: 0,
        options: { readonly: false, inputMaxLength: 255 },
        value: '',
      },
    ];
    const params = {
      checker: checkers,
      title: '添加备注',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (v) {
        item.userRemark = v.userRemark;
        this.rsList[i]['ruleList'][index]['userRemark'] = v.userRemark;
        // 背景颜色设置
        item._rowClassName = (item.file || item.userRemark) ? '' : 'ant-alert-warning';
        this.cdr.detectChanges();
        this.toValue();
      } else {
        this.toValue();
      }
    });
  }

  /**
   * 修改备注
   * @param item 规则信息
   * @param i 当前规则集下标
   * @param index 当前规则下标
   */
  editMark(item: any, i: number, index: number) {
    const checkers = [
      {
        title: '备注',
        checkerId: 'userRemark',
        type: 'text-area',
        required: 0,
        options: { readonly: false, inputMaxLength: 255 },
        value: item.userRemark,
      },
    ];
    const params = {
      checker: checkers,
      title: '修改备注',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (v) {
        item.userRemark = v.userRemark;
        this.rsList[i]['ruleList'][index]['userRemark'] = v.userRemark;
        // 背景颜色设置
        item._rowClassName = (item.file || item.userRemark) ? '' : 'ant-alert-warning';
        this.cdr.detectChanges();
        this.toValue();
      } else {
        this.toValue();
      }
    });
  }

  /**
   * table事件处理
   * @param e 表格事件
   * @param rsCode 规则集编码
   */
  handleTableChange(e: TableChange, rsCode: string) {
    switch (e.type) {
      case 'checkbox':
        this.selectedItems = e.checkbox || [];
        this.rsCode = rsCode;
        break;
      default:
        break;
    }
  }

  /**
   * 批量补充文件
   * @param e Event
   */
  batchUploadFile(e: Event) {
    e.preventDefault();
    // 校验类型
    const validateType = this.selectedItems.map((item) => item.validateType)[0];
    const validateTypeSame = this.selectedItems.every(
      (rule) => rule.validateType === validateType
    );
    // 操作类型
    const handleType = this.selectedItems.map((item) => item.handleType)[0];
    const handleTypeSame = this.selectedItems.every(
      (rule) => rule.handleType === handleType
    );
    if (validateTypeSame && handleTypeSame) {
      const checkers = [
        {
          title: '补充文件',
          checkerId: 'approvalForm',
          type: 'dragonMfile',
          required: 0,
          options: {
            filename: '',
            fileext: 'jpg, jpeg, png,pdf',
            picSize: '500',
          },
          value: '',
        },
      ];
      const params = {
        checker: checkers,
        title: '批量补充文件',
        buttons: ['取消', '确定'],
      };

      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditModalComponent,
        params
      ).subscribe((v) => {
        if (v) {
          // 将批量上传的文件设置到勾选的规则中
          this.rsList.map((rs: any) => {
            if (rs.rsCode === this.rsCode) {
              rs.ruleList.map((rule: any) => {
                this.selectedItems.map((item: any) => {
                  if (rule.id === item.id) {
                    item.file = item.file
                      ? XnUtils.mergeJsonArry(item.file, v.approvalForm)
                      : v.approvalForm;
                    rule.file = rule.file
                      ? XnUtils.mergeJsonArry(rule.file, v.approvalForm)
                      : v.approvalForm;
                    // 背景颜色设置
                    if (rule['validateType'] === RuleValidTypeEnum.STRONG_REMINDER) {
                      item._rowClassName = (item.file || item.userRemark) ? '' : 'ant-alert-warning';
                    } else {
                      item._rowClassName = item.file ? '' : 'ant-alert-warning';
                    }
                  }
                });
              });
            }
          });
          this.cdr.markForCheck();
          this.toValue();
        } else {
          this.toValue();
        }
      });
    } else {
      this.msg.warning('勾选的规则校验类型不一致，请重新勾选');
    }
  }

  /**
   * 批量添加备注
   * @param e Event
   */
  batchAddMark(e: Event) {
    e.preventDefault();
    // 操作类型都是需要添加备注的
    const needAddMark = this.selectedItems
      .map((item) => item.handleType)
      .every(
        (handleType) =>
          handleType && handleType.includes(RuleHandTypeEnum.ADD_REMARK)
      );
    if (needAddMark) {
      const checkers = [
        {
          title: '备注',
          checkerId: 'userRemark',
          type: 'text-area',
          required: 0,
          options: { readonly: false, inputMaxLength: 255 },
          value: '',
        },
      ];
      const params = {
        checker: checkers,
        title: '批量添加备注',
        buttons: ['取消', '确定'],
      };

      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditModalComponent,
        params
      ).subscribe((v) => {
        if (v) {
          // 将批量上传的文件设置到勾选的规则中
          this.rsList.map((rs) => {
            if (rs.rsCode === this.rsCode) {
              rs.ruleList.map((rule) => {
                this.selectedItems.map((item) => {
                  if (rule.id === item.id) {
                    item.userRemark = v.userRemark;
                    rule.userRemark = v.userRemark;
                    item._rowClassName = item.userRemark ? '' : 'ant-alert-warning';
                  }
                });
              });
            }
          });
          this.cdr.markForCheck();
          this.toValue();
        } else {
          this.toValue();
        }
      });
    } else {
      this.msg.warning(
        '勾选的规则校验类型中有不需要添加备注的操作，请重新勾选'
      );
    }
  }

  /**
   * 表格行的类名
   * @param record 数据源
   * @param index 下标
   */
  rowClassName = (record: TableData, index: number) => {
    if (record['validateType'] !== RuleValidTypeEnum.NON_HARD_CONTROL) {
      return (record.file || record.userRemark) ? '' : 'ant-alert-warning';
    } else {
      return ''
    }
  };
}
