/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料平台初审交易合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-30
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';
import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';

import { EditModalComponent } from '../../../modal/edit-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { XnService } from '../../../../../services/xn.service';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';

@Component({
  selector: 'dragon-plat-contract',
  template: `
    <table class="table table-bordered text-center">
      <thead>
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th *ngFor="let head of currentTab.heads">
            {{ head.label }}
            <ng-container
              *ngIf="
                head.value === 'contractType' || head.value === 'contractName'
              "
            >
              <i
                [ngClass]="{
                  'required-label-strong': true,
                  'required-star': true,
                  fa: true
                }"
              ></i>
            </ng-container>
          </th>
          <!-- 行操作 -->
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="items.length; else block">
          <tr *ngFor="let sub of items; let i = index">
            <td>{{ sub.contractId }}</td>
            <td>{{ sub.contractName }}</td>
            <td>{{ sub.contractMoney.toFixed(2) | xnMoney }}</td>
            <td>
              {{
                sub.contractType | xnSelectTransform: 'dragonContracttype' || ''
              }}
            </td>
            <td>
              <ng-container *ngIf="sub.contractFile !== ''">
                <ng-container
                  *ngIf="
                    ['sh_vanke_financing_sign'].includes(svrConfig.flow.flowId);
                    else shSign
                  "
                >
                  <a href="javascript:void(0)" (click)="viewDetail(sub, 1, i)">
                    {{
                      (sub.contractFile | xnJson).length > 1
                        ? (sub.contractFile | xnJson)[0].fileName + '，...'
                        : (sub.contractFile | xnJson)[0].fileName
                    }}
                  </a>
                </ng-container>
                <ng-template #shSign>
                  <a href="javascript:void(0)" (click)="viewDetail(sub, 2, i)">
                    {{
                      (sub.contractFile | xnJson).length > 1
                        ? (sub.contractFile | xnJson)[0].fileName + '，...'
                        : (sub.contractFile | xnJson)[0].fileName
                    }}
                  </a>
                </ng-template>
              </ng-container>
            </td>
            <td
              *ngIf="
                ![
                  'dragon_supplier_sign',
                  'cdr_supplier_sign',
                  'vanke_financing_sign',
                  'oct_financing_sign',
                  'sh_vanke_financing_sign',
                  'bgy_financing_sign',
                  'jd_financing_sign',
                  'yjl_factoring_risk',
                  'yjl_financing_sign',
                  'yjl_factoring_risk_common',
                  'yjl_financing_sign_common'
                ].includes(svrConfig.flow.flowId)
              "
            >
              <a href="javascript:void(0)" (click)="viewDetail(sub, 2, i)"
                >补充</a
              >
            </td>
            <td
              *ngIf="
                [
                  'dragon_supplier_sign',
                  'yjl_factoring_risk',
                  'yjl_factoring_risk_common'
                ].includes(svrConfig.flow.flowId) &&
                ![
                  'vanke_financing_sign',
                  'cdr_supplier_sign',
                  'oct_financing_sign',
                  'sh_vanke_financing_sign',
                  'bgy_financing_sign',
                  'jd_financing_sign',
                  'yjl_financing_sign',
                  'yjl_financing_sign_common'
                ].includes(svrConfig.flow.flowId)
              "
            >
              <a href="javascript:void(0)" (click)="viewDetail(sub, 1)">查看</a>
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="items.length > 0">
          <td>合计</td>
          <td>/</td>
          <td class="money-color">{{ amountAll | xnMoney }}</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
        </tr>
      </tbody>
    </table>
    <div
      style="padding: 0px 0px;"
      *ngIf="
        ![
          'dragon_supplier_sign',
          'vanke_financing_sign',
          'oct_financing_sign',
          'sh_vanke_financing_sign',
          'bgy_financing_sign',
          'jd_financing_sign',
          'yjl_factoring_risk',
          'yjl_financing_sign',
          'yjl_factoring_risk_common',
          'yjl_financing_sign_common'
        ].includes(svrConfig.flow.flowId)
      "
    >
      <dragon-xn-mfile-input
        [row]="fileUpload[0]"
        [form]="mainForm"
      ></dragon-xn-mfile-input>
    </div>
    <table class="table table-bordered text-center" style="float:left">
      <thead>
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th>序号</th>
          <th>合同扫描件</th>
          <!-- 行操作 -->
          <th
            *ngIf="
              ![
                'dragon_supplier_sign',
                'vanke_financing_sign',
                'cdr_supplier_sign',
                'oct_financing_sign',
                'sh_vanke_financing_sign',
                'bgy_financing_sign',
                'jd_financing_sign',
                'yjl_financing_sign',
                'yjl_financing_sign_common'
              ].includes(svrConfig.flow.flowId)
            "
          >
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngIf="fileItems.length > 0">
          <tr *ngFor="let sub of fileItems; let i = index">
            <ng-container>
              <td>
                <span>{{ i + 1 }}</span>
              </td>
              <td>
                <a href="javascript:void(0)" (click)="fileView(sub)">
                  {{
                    (sub | xnJson).length > 1
                      ? (sub | xnJson)[0].fileName + '，...'
                      : (sub | xnJson)[0].fileName
                  }}
                </a>
              </td>
              <td>
                <div
                  *ngIf="
                    ![
                      'dragon_supplier_sign',
                      'vanke_financing_sign',
                      'cdr_supplier_sign',
                      'oct_financing_sign',
                      'sh_vanke_financing_sign',
                      'bgy_financing_sign',
                      'jd_financing_sign',
                      'yjl_factoring_risk',
                      'yjl_financing_sign',
                      'yjl_factoring_risk_common',
                      'yjl_financing_sign_common'
                    ].includes(svrConfig.flow.flowId)
                  "
                >
                  <a href="javascript:void(0)" (click)="changeFile(sub, i + 1)"
                    >修改</a
                  >
                  <br />
                  <a href="javascript:void(0)" (click)="deleteFile(i)">删除</a>
                </div>
                <a
                  *ngIf="row?.options?.readonly"
                  href="javascript:void(0)"
                  (click)="fileView(sub)"
                  >查看</a
                >
              </td>
            </ng-container>
          </tr>
        </ng-container>
      </tbody>
    </table>
    <span class="xn-input-alert">{{ alert }}</span>
    <div>
      <span style="width:37%">合同账户信息与供应商收款账户信息是否一致</span>
      <input
        style="padding-top:6px"
        #input
        class="form-control xn-input-font xn-input-border-radius"
        [ngClass]="myClass"
        type="text"
        nz-buttonautocomplete="off"
        [value]="flag"
        readonly
      />
    </div>
    <ng-template #block>
      <tr>
        <td [attr.colspan]="6">
          <div class="empty-message"></div>
        </td>
      </tr>
    </ng-template>
  `,
  styles: [
    `
      .button-reset-style {
        font-size: 12px;
        padding: 5px 35px;
        color: #3c8dbc;
      }

      .tip-memo {
        color: #9a9a9a;
      }
      .tag-color {
        color: #f20000;
      }
    `,
  ],
})
@DynamicForm({ type: 'plat-contract', formModule: 'dragon-input' })
export class DragonPlatContractComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  public ctrl1: AbstractControl;
  public items: any;
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  alert = '';
  public copyItems: any[] = [];
  public amountAll: number; // 合同总金额
  public xnOptions: XnInputOptions;
  public flag = ''; // 判断合同账户信息与供应商收款账户信息是否一致
  public datainfo = {
    contractId: '',
    contractMoney: '',
    contractName: '',
    contractType: '',
    debtUnit: '',
    debtUnitAccount: '',
    debtUnitBank: '',
    debtUnitName: '',
    projectCompany: '',
    receive: '',
    signTime: '',
    totalReceive: '',
    payRate: '',
    contractJia: '',
    contractYi: '',
    percentOutputValue: '',
    payType: '',

    feeTypeName: '',
    type: '',
    wkType: '',
    index: 0,
    headquarters: '',
    contractTypeJd: '',
  };
  mainForm: FormGroup;
  public fileUpload = [
    {
      name: '',
      checkerId: 'contractUpload',
      type: 'dragonMfile',
      required: 1,
      value: '',
      options:
        '{"filename": "交易合同","fileext": "jpg, jpeg, png,pdf", "picSize": "500"}',
    },
  ];
  public myClass = '';
  fileItems: any;
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private er: ElementRef,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (
      [
        'vanke_platform_verify',
        'oct_financing_sign',
        'sh_vanke_platform_verify',
      ].includes(this.row.flowId)
    ) {
      this.fileUpload[0].options =
        '{"filename": "交易合同","fileext": "jpg, jpeg, png", "picSize": "500"}';
    }
    if (
      ![
        'dragon_supplier_sign',
        'oct_financing_sign',
        'vanke_financing_sign',
        'sh_vanke_financing_sign',
        'bgy_financing_sign',
        'jd_financing_sign',
        'yjl_financing_sign',
      ].includes(this.svrConfig.flow.flowId)
    ) {
      this.ctrl1 = this.form.get('performanceFile');
      this.ctrl1.valueChanges.subscribe((x) => {
        if (x !== '') {
          this.copyItems = JSON.parse(x);
          delete this.copyItems[0].contractFile;
          delete this.copyItems[0].inutFile;
          delete this.copyItems[0].performanceFile;
          const objKey = Object.keys(this.datainfo);
          for (const key of objKey) {
            if (this.copyItems[0][key] !== this.items[0][key]) {
              this.copyItems.forEach((y) => {
                this.items[0] = Object.assign({}, this.items[0], y);
              });
              this.toValue();
            }
          }
        }
      });
    }
    this.currentTab = DragonInfos.platContract;
    this.items = JSON.parse(this.row.value);
    // console.log('type: plat-contract', this.row.value);
    if (!!!this.items[0].inputFile) {
      const otherFile = [];
      otherFile.push(this.items[0].contractFile);
      this.items[0].inputFile = JSON.stringify(otherFile);
      this.fileItems = JSON.parse(this.items[0].inputFile);
    } else {
      this.fileItems = JSON.parse(this.items[0].inputFile);
    }
    XnFormUtils.convertChecker(this.fileUpload[0]);
    this.mainForm = XnFormUtils.buildFormGroup(this.fileUpload);
    this.items.forEach((x) => {
      if (!x.flag) {
        this.flag = '';
      } else {
        this.flag = x.flag === 0 ? '否' : '是';
      }
      if (x.contractMoney !== '') {
        x.contractMoney = Number(x.contractMoney);
      }
    });
    this.mainForm.valueChanges.subscribe((x) => {
      this.fileItems.push(x.contractUpload);
      this.getFile();
    });
    this.ctrl.statusChanges.subscribe(() => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.fromValue();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    // console.info('this.items', this.items);
  }

  private fromValue() {
    this.items = XnUtils.parseObject(this.ctrl.value, []);
    this.toValue();
  }
  // 获取文件
  private getFile() {
    const fileList = [];
    if (this.fileItems.length > 0) {
      /** TODO: 这里需要优化循环方法 */
      for (let i = 0; i < this.fileItems.length; i++) {
        for (let j = 0; j < JSON.parse(this.fileItems[i]).length; j++) {
          fileList.push(JSON.parse(this.fileItems[i])[j]);
        }
      }
      this.items[0].contractFile = JSON.stringify(fileList);
      this.items[0].inputFile = JSON.stringify(this.fileItems);
      this.ctrl.markAsTouched();
      console.log('this.fileItems', this.fileItems);
      this.toValue();
    } else {
      this.items[0].contractFile = '';
      this.toValue();
    }
  }
  public fileView(paramFiles) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      JsonTransForm(paramFiles)
    ).subscribe(() => {});
  }

  viewDetail(sub: any, paramType: number, index?: number) {
    let type = 0;
    const componentType = [
      'dragon_platform_verify',
      'dragon_supplier_sign',
    ].includes(this.row.flowId)
      ? 'dragonContract'
      : 'vankeContract';
    this.xn.dragon
      .post('/contract_temporary/view', {
        mainFlowId: this.svrConfig.record.mainFlowId,
      })
      .subscribe((x) => {
        if (x.ret === 0) {
          if (x.data.data.contractName === undefined) {
            this.datainfo = sub;
            this.datainfo.feeTypeName = x.data.data.feeTypeName;
            this.datainfo.type = x.data.data.type;
            this.datainfo.wkType = x.data.data.wkType;
            this.datainfo.headquarters = x.data.data.headquarters || '';
            this.datainfo.contractTypeJd = x.data.data.contractTypeJd || '';
          } else {
            this.datainfo = x.data.data;
            this.datainfo.contractTypeJd = x.data.data.contractTypeJd || '';
          }
          if (paramType === 1) {
            type = 1;
          } else {
            type = 2;
          }
          this.datainfo.totalReceive === '' ||
          this.datainfo.totalReceive === undefined
            ? (this.datainfo.totalReceive = '')
            : (this.datainfo.totalReceive = this.ReceiveData(
                this.datainfo.totalReceive.toString()
              ).toFixed(2));
          this.datainfo.percentOutputValue === '' ||
          this.datainfo.percentOutputValue === undefined
            ? (this.datainfo.percentOutputValue = '')
            : (this.datainfo.percentOutputValue = this.ReceiveData(
                this.datainfo.percentOutputValue.toString()
              ).toFixed(2));
          this.datainfo.index = index + 1;
          const params = {
            title: '交易合同',
            type: this.row?.options?.readonly ? 1 : type,
            mainFlowId: this.svrConfig.record.mainFlowId,
            debtUnit: sub.debtUnit || '',
            projectCompany: sub.projectCompany || '',
            receive: sub.receive || '',
            contractFile: sub.contractFile,
            inputFile: sub.inputFile,
            checker: ContractAndPerformanceSupply.getConfig(
              componentType,
              this.row?.options?.readonly ? 1 : type,
              this.datainfo,
              this.row
            ),
          };
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DragonViewContractModalComponent,
            params
          ).subscribe((v) => {
            if (v.action === 'cancel') {
              return;
            } else {
              sub.contractId = v.contractInfo.contractId;
              sub.contractMoney = v.contractInfo.contractMoney;
              sub.contractName = v.contractInfo.contractName;
              sub.contractType = Number(v.contractInfo.contractType);
              sub.debtUnitAccount = v.contractInfo.debtUnitAccount;
              sub.debtUnitName = v.contractInfo.debtUnitName;
              sub.debtUnitBank = v.contractInfo.debtUnitBank;
              sub.signTime = v.contractInfo.signTime;
              sub.payType = v.contractInfo.payType;
              sub.percentOutputValue = v.contractInfo.percentOutputValue;
              sub.contractYi = v.contractInfo.contractYi;
              sub.contractJia = v.contractInfo.contractJia;
              sub.payRate = v.contractInfo.payRate;
              sub.owner = 'lvyue';
              sub.totalReceive = v.contractInfo.totalReceive;
              sub.flag = v.flag;
              this.toValue();
              this.cdr.markForCheck();
            }
          });
        }
      });
  }
  // 上传完后取回值
  private toValue() {
    this.items.map(() => {
      this.items.forEach((x) => {
        if (!x.flag && x.flag !== 0) {
          this.flag = '';
        } else {
          this.flag = x.flag === 0 ? '否' : '是';
        }
        if (x.contractMoney !== '') {
          x.contractMoney = Number(x.contractMoney);
        }
        x.owner = 'lvyue';
      });
      if (this.items.filter((v) => v && v.contractMoney).length > 0) {
        this.amountAll =
          this.computeSum(
            this.items
              .filter((v) => v && v.contractMoney)
              .map((v) => v.contractMoney)
          ).toFixed(2) || 0;
      } else {
        this.amountAll = 0;
      }
      this.ctrl.setValue(JSON.stringify(this.items));
    });
    this.localStorageService.setCacheValue('VankecontractFile', this.items); // 保存值
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
  // 删除文件
  deleteFile(index: number) {
    this.fileItems.splice(index, 1);
    this.cdr.markForCheck();
    this.getFile();
  }
  // 修改文件
  changeFile(paramFiles, paramIndex: number) {
    const params = {
      title: '合同修改弹窗',
      checker: [
        {
          title: '合同文件序号',
          checkerId: 'fileId',
          type: 'text',
          options: { readonly: true },
          value: paramIndex,
          required: false,
        },
        {
          title: '合同文件图片',
          checkerId: 'paramFile',
          type: 'dragonMfile',
          options: [
            'vanke_platform_verify',
            'oct_platform_verify',
            'sh_vanke_platform_verify',
          ].includes(this.row.flowId)
            ? { fileext: 'jpg, jpeg, png', picSize: '500' }
            : { fileext: 'jpg, jpeg, png,pdf', picSize: '500' },
          required: true,
          value: paramFiles,
        },
      ],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((x) => {
      if (x !== null) {
        paramFiles = x.paramFile;
        this.fileItems[paramIndex - 1] = paramFiles;
        this.cdr.markForCheck();
        this.getFile();
      }
    });
  }
  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr) => {
      return prev + curr;
    });
  }
  // 计算应收账款转让金额
  public ReceiveData(item: any) {
    let tempValue = item.replace(/,/g, '');
    tempValue = parseFloat(tempValue).toFixed(2);
    return Number(tempValue);
  }
}
