import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './textarea-input.component.html',
    styles: [
        `.xn-input-textarea {resize: none}
      .go-check{
          float: right;
          margin: -65px -115px 0 0;
      }
      .go-check.span{
           color: red;
           margin-top: -100px;
       }`
    ]
})
@DynamicForm({ type: 'textarea', formModule: 'default-input' })
export class TextareaInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    myClass = '';
    alert = '';
    goCheck: number;
    msg = '';
    msgStr = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    showDown = false; // 是否展示提示信息

    constructor(private er: ElementRef, private xn: XnService,) {
    }

    ngOnInit() {
        /**
         * 查询业务的中登是否已变更
         */
        if (this.row.title === '更正登记描述') {
            this.xn.dragon.post2('/zhongdeng/zd/isAmend',
                { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                    if (x.ret === 0) {
                        this.goCheck = x.data.status;
                        this.msg = x.data.msg;
                        switch (x.data.status) {
                            case 0:
                                this.msgStr = '未登记';
                                break;
                            case 1:
                                this.msgStr = '登记中';
                                break;
                            case 2:
                                this.msgStr = '登记失败';
                                break;
                            case 3:
                                this.msgStr = '登记完成';
                                break;
                            case 4:
                                this.msgStr = '撤销登记';
                                break;
                            case 5:
                                this.msgStr = '待登记';
                                break;
                            case 6:
                                this.msgStr = '已变更';
                                break;
                            case 7:
                                this.msgStr = '变更中';
                                break;
                            case 8:
                                this.msgStr = '已注销';
                                break;
                        }
                        return this.msgStr;
                    }
                });
        }

        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass(); // 通用签章流程供应商签署时是否显示信息
        if (this.form.get('signType')) {
            this.showDown = this.form.get('signType').value === '1' ? true : false;
        }
        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }
    calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /***
     * 获取业务的中登信息
     */
    goRegister() {
        this.xn.dragon.post2('/zhongdeng/zd/getZDInfo',
            { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
                if (x.ret === 0) {
                    if (x.data.zhongdengRegisterId === '') {
                        return this.xn.msgBox.open(false, '找不到相关的中登记录');
                    } else {
                        this.xn.router.navigate(
                            [`/machine-account/zhongdeng/record/${x.data.zhongdengRegisterId}/${x.data.zhongdengStatus}`
                            ], { queryParams: { mainFlowId: x.data.mainFlowId, accountMask: true } });
                    }
                }
            });
    }
}
