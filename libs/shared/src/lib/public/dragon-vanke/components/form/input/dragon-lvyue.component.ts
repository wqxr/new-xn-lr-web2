import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonViewContractModalComponent } from '../../../modal/dragon-mfile-detail.modal';
import { EditModalComponent } from '../../../modal/edit-modal.component';
import * as moment from 'moment';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import ContractAndPerformanceSupply from '../../bean/supplement-checkers.tab';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { HomeCommListComponent } from '../../../../component/home-comm-list.component';
@Component({
  template: `
    <div class="input-group" style="width: 100%" [formGroup]="form">
    <table class="table table-bordered table-hover file-row-table text-center" width="100%" >
      <thead>
      <tr>
        <th>
          <span class="span-line">文件</span>
        </th>
        <ng-container *ngIf="row.flowId!=='dragon_platform_verify'">
          <th>
            <span class="span-line">本次产值金额</span>
            <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
          </th>
          <th>
            <span class="span-line">本次付款性质</span>
            <i [ngClass]="{'required-label-strong': true,'required-star': true,'fa': true}"></i>
          </th>
        </ng-container>
        <th>
          <span class="span-line">累计确认产值</span>
        </th>
        <th>
          <span class="span-line">操作</span>
        </th>
      </tr>
      </thead>
      <tbody>

      <tr *ngFor="let sub of items;let i=index">
      <ng-container *ngIf="!!sub.performanceFile">
        <td>
          <a class="xn-click-a" (click)="onEdit(sub,2,i)">
          {{(sub.performanceFile | xnJson).length>1 ? (sub.performanceFile | xnJson)[0].fileName + '，...' : (sub.performanceFile | xnJson)[0].fileName}}
          </a>
        </td>
        <ng-container *ngIf="row.flowId!=='dragon_platform_verify'">
          <td>
            <ng-container *ngIf="sub.percentOutputValue!==''">
              {{sub.percentOutputValue.toFixed(2) | xnMoney}}
            </ng-container>
          </td>
          <td>
            <ng-container *ngIf="sub.payType!==''">
              {{sub.payType | xnSelectTransform:'vankePayType'}}
            </ng-container>
          </td>
        </ng-container>
        <td>
          <ng-container *ngIf="sub.totalReceive!==''">
            {{sub.totalReceive.toFixed(2) | xnMoney}}
          </ng-container>
        </td>
        <td *ngIf="svrConfig.flow.flowId!=='dragon_supplier_sign'">
          <a class="xn-click-a" (click)="onEdit(sub,2,i)">补充</a>&nbsp;&nbsp;
          <a class="xn-click-a" (click)="changeFile(sub)">修改文件</a>
        </td>
        <td *ngIf="svrConfig.flow.flowId==='dragon_supplier_sign'">
        <a class="xn-click-a" (click)="onEdit(sub,1,i)">查看</a>
      </td>
      </ng-container>
      </tr>

      </tbody>
    </table>
  </div>
  <span class="xn-input-alert">{{alert}}</span>

    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../show-dragon-input.component.css'],

})
// 获取移动端图片checker项
@DynamicForm({ type: 'platDragon-performance', formModule: 'dragon-input' })
export class DragonlvyueComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public alert = '';
  public ctrl: AbstractControl;
  public payablesCtrl: AbstractControl; // 应收帐款金额
  public headquartersCtrl: AbstractControl; // 总部公司
  public xnOptions: XnInputOptions;
  public ctrl1: AbstractControl;
  public copyItems: any[] = [];
  public items: any[] = [];
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
  };
  public constructor(private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.items = !!this.row.value ? JSON.parse(this.row.value) : [];
    this.items.forEach(y => {
      if (y.percentOutputValue !== '') {
        y.percentOutputValue = Number(y.percentOutputValue);
      }
      if (y.totalReceive !== '') {
        y.totalReceive = Number(y.totalReceive);
      }
    });
    this.ctrl1 = this.form.get('dealContract');
    this.ctrl1.valueChanges.subscribe(x => {
      if (x !== '') {
        this.copyItems = JSON.parse(x);
        delete this.copyItems[0].contractFile;
        delete this.copyItems[0].inutFile;
        delete this.copyItems[0].performanceFile;
        const objKey = Object.keys(this.datainfo);
        for (let i = 0; i < objKey.length; i++) {
          if (this.copyItems[0][objKey[i]] !== this.items[0][objKey[i]]) {
            this.copyItems.forEach(y => {
              this.items[0] = Object.assign({}, this.items[0], y);
            });
            this.toValue();
          }
        }
      }
      this.cdr.markForCheck();
    });
    this.toValue();
  }
  changeFile(paramsData) {
    const params = {
      title: '履约证明修改弹窗',
      checker: [
        {
          title: '履约证明',
          checkerId: 'paramFile',
          type: 'dragonMfile',
          options: { fileext: 'jpg, jpeg, png,pdf', picSize: '500' },
          required: true,
          value: paramsData.performanceFile,

        }
      ]
    };
    if (this.row.flowId === 'dragon_platform_verify') {
      params.checker[0].options = { fileext: 'jpg, jpeg, png', picSize: '500' };
    }
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((x) => {
        if (x !== null) {
          paramsData.performanceFile = x.paramFile;
          this.cdr.markForCheck();
          this.toValue();
        }
      });
  }

  /**
   *  补充履约证明信息
   * @param sub
   */
  onEdit(sub: any, type: number, index?: number) {
    const componentType = ['dragon_platform_verify', 'dragon_supplier_sign'].includes(this.row.flowId) ? 'dragonLvYue' : 'vankeLvYue';
    this.xn.dragon.post('/contract_temporary/view', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
      if (x.ret === 0) {
        if (x.data.data.contractName === undefined) {
          this.datainfo = sub;
          this.datainfo.feeTypeName = x.data.data.feeTypeName;
          this.datainfo.type = x.data.data.type;
          this.datainfo.wkType = x.data.data.wkType;
        } else {
          this.datainfo = x.data.data;
        }
        if (this.datainfo.totalReceive === '' || this.datainfo.totalReceive === undefined) {
          this.datainfo.totalReceive = '';
        } else {
          this.datainfo.totalReceive = this.ReceiveData(this.datainfo.totalReceive.toString()).toFixed(2);
        }
        if (this.datainfo.percentOutputValue === '' || this.datainfo.percentOutputValue === undefined) {
          this.datainfo.percentOutputValue = '';
        } else {
          this.datainfo.percentOutputValue = this.ReceiveData(this.datainfo.percentOutputValue.toString()).toFixed(2);
        }
        this.datainfo.index = index + 1;
        const params = {
          title: '履约证明',
          type,
          mainFlowId: this.svrConfig.record.mainFlowId,
          debtUnit: this.datainfo.debtUnit || '',
          projectCompany: this.datainfo.projectCompany || '',
          receive: this.datainfo.receive || '',
          contractFile: sub.performanceFile,
          checker: ContractAndPerformanceSupply.getConfig(componentType, type, this.datainfo, this.row)
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonViewContractModalComponent, params).subscribe(v => {
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
            sub.flag = v.flag;
            sub.owner = 'contract';
            sub.totalReceive = v.contractInfo.totalReceive;
            this.toValue();
            this.cdr.markForCheck();

          }
        });
      }
    });


  }

  /**
   * 保存修改值并格式化
   */
  private toValue() {
    // let contractInfo = JSON.parse(this.form.value.dealContract);
    // contractInfo.forEach(y => {
    //   this.items[0] = Object.assign({}, this.items[0], y);
    // });
    if (this.items.length === 0) {
      this.ctrl.setValue('');
    } else {
      let isOk = true;
      this.items.forEach(x => {
        if (!!!x.performanceFile) {
          isOk = false;
        }
        x.owner = 'contract';
      });
      if (!isOk) {
        this.ctrl.setValue('');
      } else {
        this.items.forEach(y => {
          if (y.percentOutputValue !== '') {
            y.percentOutputValue = Number(y.percentOutputValue);
          }
          if (y.totalReceive !== '') {
            y.totalReceive = Number(y.totalReceive);
          }
        });
        this.ctrl.setValue(JSON.stringify(this.items));

      }
    }
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
  // 计算应收账款转让金额
  public ReceiveData(item: any) {
    let tempValue = item.replace(/,/g, '');
    tempValue = parseFloat(tempValue).toFixed(2);
    return Number(tempValue);
  }
}
