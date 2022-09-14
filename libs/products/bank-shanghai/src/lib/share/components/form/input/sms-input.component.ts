import {Component, OnInit, Input, OnDestroy, ElementRef, ChangeDetectorRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
// import {XnFormUtils} from '../../common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {Subscription} from 'rxjs';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
// import {XnInputOptions} from './xn-input.options';
// import {XnService} from '../../services/xn.service';

@Component({
    selector: 'xn-sh-sms-input',
    templateUrl: './sms-input.component.html',
    styles: [`
    .msg-alert {
        color: #8d4bbb;
        font-size: 12px;
    }
    `]
})
@DynamicForm({ type: 'sms-input', formModule: 'dragon-input' })
export class ShangHaiSmsInputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    sendMsg = '';
    ctrl: AbstractControl;
    mobileCtrl: AbstractControl;
    ctrlSubscription: Subscription;
    mobileCtrlSubscription: Subscription;

    xnOptions: XnInputOptions;

    btnText = '获取验证码';
    btnEnabled = false;
    time = 0;
    timer: any = null;

    constructor(private xn: XnService, private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrlSubscription = this.ctrl.valueChanges.subscribe(v => {
            // console.log('ctrlSubscription', v);
            // this.ctrl.markAsTouched();
            this.calcAlertClass();
        });

        // 如果要求和手机号字段对应上，就要等手机号填了才能发送短信验证码
        if (this.row.validators && this.row.validators.sms && this.row.validators.sms.name) {
            this.mobileCtrl = this.ctrl.root.get(this.row.validators.sms.name);
            this.btnEnabled = this.mobileCtrl.valid;
            this.mobileCtrlSubscription = this.mobileCtrl.valueChanges.subscribe(v => {
                this.btnEnabled = this.mobileCtrl.valid;
                if (this.ctrl.touched) {
                    this.ctrl.updateValueAndValidity();
                } else {
                    // this.ctrl.markAsUntouched(true);
                    // console.log('markAsUntouched-1', this.ctrl.touched);
                    this.ctrl.updateValueAndValidity();
                    // console.log('markAsUntouched-2', this.ctrl.touched);
                    this.ctrl.markAsUntouched({onlySelf: true});
                    // console.log('markAsUntouched-3', this.ctrl.touched);
                }
            });
        } else {
            this.btnEnabled = true;
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }

    onSend() {
        let mobile = '';
        if (this.row.validators && this.row.validators.sms && this.row.validators.sms.name) {
            if (isNullOrUndefined(this.mobileCtrl)) {
                this.alert = '没有手机号码字段';
                return;
            } else {
                mobile = this.mobileCtrl.value;
            }
        }

        // console.log('onSend', mobile, this.time);
        if (this.time <= 0) {
            // 发给validators里指定字段的手机号
            this.sendSmsCode(mobile);

            // 倒计时
            this.time = 60;
            this.timer = setInterval(() => {
                --this.time;
                if (this.time <= 0) {
                    if (this.timer !== null) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    this.btnText = `获取验证码`;
                    this.btnEnabled = true;
                } else {
                    this.btnText = `${this.time}秒后可重发`;
                }
            }, 1000);
            this.btnEnabled = false;
        }
    }

    /**
     * @description: 调用发送验证码接口
     * @param {string | number} mobile 手机号
     * @return {*}
     */
    sendSmsCode(mobile: string | number) {
        // this.ctrl = this.form.get('');
        const params = {
            mainFlowId: this.row.options.others.mainFlowId
        };
        console.log('sendSmsCode----------', params);
        this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/prattwhitneyDynamicCode', params).subscribe(x => {
          if (x && x.ret === 0) {
            let errMsg = '';
            let errCode = '';
            if (x.data && x.data.err === 0){
                if (x.data.data && x.data.data.errcode !== 0){
                    errMsg = x.data.msg || '';
                    errCode = x.data.errcode.toString() || '';
                }
            } else if (x.data && x.data.err !== 0){
                errMsg = x.data.msg || '';
                errCode = x.data.err.toString() || '';
            }
            this.sendMsg = !!errMsg ? `请求失败：${errMsg}(错误代码: ${errCode})` : `验证已发送到您手机，请注意查收`;
            this.cdr.markForCheck();
          }
        });
    }

    ngOnDestroy() {
        if (!isNullOrUndefined(this.timer)) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (!isNullOrUndefined(this.ctrlSubscription)) {
            this.ctrlSubscription.unsubscribe();
            this.ctrlSubscription = null;
        }

        if (!isNullOrUndefined(this.mobileCtrlSubscription)) {
            this.mobileCtrlSubscription.unsubscribe();
            this.mobileCtrlSubscription = null;
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
