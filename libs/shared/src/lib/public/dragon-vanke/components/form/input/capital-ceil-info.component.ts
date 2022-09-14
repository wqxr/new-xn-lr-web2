import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { EditModalComponent } from '../../../modal/edit-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnService } from '../../../../../services/xn.service';
declare const moment: any;

@Component({
    template: `
      <div style='padding: 2px 5px;width: 120px' class="btn btn-default btn-file xn-table-upload block"
        (click)="addCeil()">
        <span class="hidden-xs xn-input-font">增加层级</span>
      </div>
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th>层级名称</th>
            <th>层级金额</th>
            <th>证券预期到期日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor='let item of datalist01;let i=index'>
            <td>{{item.investTierName}}</td>
            <td>{{item.tierReceive.toFixed(2) | xnMoney}}</td>
            <td>{{item.productendTime | xnDate :'date'}}</td>
            <td><a href="javaScript:void(0)"
                (click)='changeRece(item ,i)'>修改</a>&nbsp;&nbsp;<a
                href="javaScript:void(0)" (click)='delete(i)'>删除层级</a></td>
          </tr>
          <tr *ngIf='datalist01.length>0'>
          <td>汇总</td>
          <td>{{total.toFixed(2) | xnMoney}}</td>
          <td>/</td>
          <td>/</td>
        </tr>
        </tbody>
      </table>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../show-dragon-input.component.css']
})
// 查看二维码checker项
@DynamicForm({ type: 'add-ceil', formModule: 'dragon-input' })
export class VankeCapitaladdCeilComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    capitalId: string; // 资产池编号
    datalist01: any[] = []; // 层级信息列表
    total: any; // 层级金额汇总

    constructor(private er: ElementRef, private xn: XnService,
        private vcr: ViewContainerRef, private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        this.capitalId = this.row.value1;
        // 获取当前资产池层级信息
        this.xn.dragon.post('/project_manage/pool/pool_invest_tier_list', { capitalPoolId: this.capitalId }).subscribe(x => {
            if (x.ret === 0) {
                this.datalist01 = x.data.rows;
                this.total = x.data.sumReceive;
                this.cdr.markForCheck();
                this.ctrl.setValue(this.datalist01);
            }
        });
        this.ctrl.valueChanges.subscribe(() => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }


    /**
     *  增加层级
     *  @param
    */
    addCeil() {
        const checkers = [{
            title: '层级名称',
            checkerId: 'investTierName',
            type: 'text',
            required: 1,
            value: '',
        },
        {
            title: '层级金额',
            checkerId: 'tierReceive',
            type: 'money',
            required: 1,
            value: '',
        },
        {
            title: '产品到期日',
            checkerId: 'productendTime',
            type: 'date',
            required: 0,
            value: '',
        }
        ];
        const params = {
            checker: checkers,
            title: '增加投资层级',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
                if (v === null) {
                    return;
                } else {
                    v.tierReceive = v.tierReceive ? v.tierReceive : '0'
                    // isSame 是否已经存在 层级名称重复
                    const isSame = this.datalist01.filter(x => v.investTierName === x.investTierName);
                    // 重复的层级名称
                    if (isSame.length > 0) {
                        return this.xn.msgBox.open(false, `层级名称: ${v.investTierName} 已存在`);
                    } else {
                        this.datalist01.push({
                            invest_tier_id: 0,
                            investTierName: v.investTierName,
                            tierReceive: v.tierReceive ? this.ReceiveData(v.tierReceive) : this.ReceiveData('0'),
                            productendTime: moment(v.productendTime).valueOf()
                        });
                        this.ctrl.setValue(this.datalist01);
                        this.total = this.computeSum(this.datalist01.filter(v =>
                            v && v.tierReceive).map(v => v.tierReceive));
                        // 动态获取最大 证券预期到期日 赋值给 专项计划预期到期日
                        this.setProductendTime();
                        this.cdr.markForCheck();
                    }
                }
            });
    }

    /**
     *  修改层级
     *  @param
    */
    changeRece(paramInfo: any, paramIndex: number) {
        const checkers = [{
            title: '层级名称',
            checkerId: 'investTierName',
            type: 'text',
            required: 1,
            value: paramInfo.investTierName,
        },
        {
            title: '层级金额',
            checkerId: 'tierReceive',
            type: 'money',
            required: 1,
            value: paramInfo.tierReceive,
        },
        {
            title: '产品到期日',
            checkerId: 'productendTime',
            type: 'date',
            required: 0,
            value: paramInfo.productendTime ? moment(paramInfo.productendTime).format('YYYY-MM-DD') : '',
        }
        ];

        const params = {
            checker: checkers,
            title: '修改投资层级',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
                if (v === null) {
                    return;
                } else {
                    // isSame 是否已经存在 层级名称重复
                    const isSame = this.datalist01.filter(x => v.investTierName === x.investTierName);
                    // 重复的层级名称
                    if (isSame.length > 0 && paramInfo.investTierName !== v.investTierName) { // 修改了名称重复
                        return this.xn.msgBox.open(false, `层级名称: ${v.investTierName} 已存在`);
                    } else {
                        this.datalist01[paramIndex].investTierName = v.investTierName;
                        this.datalist01[paramIndex].tierReceive = this.ReceiveData(v.tierReceive);
                        this.datalist01[paramIndex].productendTime = moment(v.productendTime).valueOf();
                        this.ctrl.setValue(this.datalist01);
                        // 动态获取最大 证券预期到期日 赋值给 专项计划预期到期日
                        this.setProductendTime();
                        this.cdr.markForCheck();
                    }
                }
            });
    }

    /**
     *  删除层级
     *  @param
    */
    delete(paramIndex: number) {
        this.datalist01.splice(paramIndex, 1);
        this.ctrl.setValue(this.datalist01);
        // 动态获取最大 证券预期到期日 赋值给 专项计划预期到期日
        this.setProductendTime();
        this.cdr.markForCheck();
    }

    /**
     *  动态设置专项计划预期到期日
     *  @param
    */
    setProductendTime() {
        // 动态获取最大 证券预期到期日 赋值给 专项计划预期到期日
        const productendTime = this.datalist01.map((x: any) => x.productendTime).sort((a, b) => b - a)[0];
        const ctrlProductendTime = this.form.get('productendTime'); // 专项计划预期到期日
        ctrlProductendTime.setValue(moment(productendTime).format('YYYY-MM-DD'));
    }

    // 具体到单个数组的求和
    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.includes(',') ? item.replace(/,/g, '') : item;
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
