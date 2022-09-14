import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import DragonpaymentTabConfig from '../../../../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'dragon-payment-info',
    template: `
    <table class="table table-bordered table-striped text-center" >
    <thead>
      <tr class="table-head">
        <!-- 全选按钮 -->
        <!-- title -->
        <th>序号</th>
        <th *ngFor="let head of currentTab.heads">
          {{head.label}}
        </th>
        <!-- 行操作 -->
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
        <ng-container  *ngIf="items.length" >
            <tr *ngFor="let item of items;let i=index">
            <td>{{i+1}}</td>
            <td *ngFor="let head of currentTab.heads">
            <ng-container [ngSwitch]="head.type">
            <ng-container *ngSwitchCase="'mainFlowId'">
            <a href="javaScript:void(0)"
               (click)="hwModeService.DragonviewProcess(item[head.value])">{{item[head.value]}}</a>
          </ng-container>
          <ng-container *ngSwitchCase="'contract'">
          <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
            <ng-container *ngIf="judgeDataType(jsonTransForm(item[head.value])); else block3">
              <div *ngFor="let sub of item[head.value] | xnJson; let i=index">
                <a href="javaScript:void(0)" (click)="showContract(sub)">{{sub.label}}</a>
              </div>
            </ng-container>
            <ng-template #block3>
              <a href="javaScript:void(0)" (click)="showContract(jsonTransForm(item[head.value]))">
                {{jsonTransForm(item[head.value])['label']}}</a>
            </ng-template>
          </ng-container>
        </ng-container>
          <ng-container *ngSwitchCase="'file'">
          <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
            <div *ngFor="let sub of item[head.value] | xnJson">
              <a href="javaScript:void(0)" (click)="viewFiles(sub)">{{sub.fileName}}</a>
            </div>
          </ng-container>
          </ng-container>

        <ng-container *ngSwitchCase="'result'">
        <div *ngIf='item.flag===true'>匹配成功</div>
        <div *ngIf='item.flag===false'>未匹配</div>
          </ng-container>
          <ng-container *ngSwitchDefault>
            <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
          </ng-container>
            </ng-container>
            </td>
            <td> <a class="xn-click-a" (click)='delFile(i)'>删除</a></td>

            </tr>
            </ng-container>


    </tbody>
  </table>
  <span class="xn-input-alert">{{alert}}</span>

    `,
    styles: [
        `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9A9A9A;
            }
            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
@DynamicForm({ type: 'person-list1', formModule: 'dragon-input' })
export class DragonPaymentInfoComponent implements OnInit {
    @Input()
    row: any;
    @Input()
    form: FormGroup;
    @Input()
    svrConfig: any;
    public ctrl: AbstractControl;
    public ctrl1: AbstractControl;
    ctrl2: AbstractControl;
    public items: any[] = [];
    public Tabconfig: any;
    selectValue = '';
    currentTab: any; // 当前标签页
    alert = '';
    public xnOptions: XnInputOptions;
    public flag = ''; // 判断合同账户信息与供应商收款账户信息是否一致
    dragonFileType = [
        { label: '《付款确认书(总部致保理商)》', value: 1 },
        { label: '《付款确认书(总部致劵商)》', value: 2 },
    ];
    yajuleFileType = [
        { label: '《付款确认书(总部致保理商)》', value: 1 },
    ];
    vankeFileType = [
        { label: '《付款确认书》', value: 1 },
    ];
    public myClass = '';
    constructor(private xn: XnService, private vcr: ViewContainerRef, private cdr: ChangeDetectorRef, private er: ElementRef, public hwModeService: HwModeService) {
    }
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.currentTab = DragonpaymentTabConfig.personMatch;
        this.items = JSON.parse(this.row.value);
        this.ctrl1 = this.form.get('headquarters');
        this.ctrl2 = this.form.get('fileUpload');
        // this.mainFlowIds = JSON.parse(this.ctrl2.value).map((x: any) => x.mainFlowId);

        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    viewFiles(params) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(v => {
            if (v.action === 'cancel') {
                return;
            } else {
            }
        });
    }
    // 删除文件
    delFile(index: number) {
        this.items.splice(index, 1);
        this.toValue();
    }
    getFileType(e) {
        this.selectValue = e.target.value;
    }
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }
    /**
   *  格式化数据
   * @param data
   */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        }
        else {
            this.items.forEach(() => {
                this.ctrl.setValue(JSON.stringify(this.items));
            });
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
