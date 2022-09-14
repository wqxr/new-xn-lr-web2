import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import { XnInputOptions } from './xn-input.options';
import { XnService } from '../../services/xn.service';

@Component({
    selector: 'xn-sms-input',
    templateUrl: './sms-input.component.html',
    styles: []
})
export class SmsInputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    mobileCtrl: AbstractControl;
    ctrlSubscription: Subscription;
    mobileCtrlSubscription: Subscription;

    xnOptions: XnInputOptions;

    btnText = '获取验证码';
    btnEnabled = false;
    time = 0;
    timer: any = null;

    constructor(private xn: XnService, private er: ElementRef) {
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
                    this.ctrl.markAsUntouched({ onlySelf: true });
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
    getSms(event) {
        if ((event.keyCode || event.witch) === 13) { // 删除键
            this.onSend();
        }
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
            if (this.row.options.sendMe) {
                // 发给当前登录用户
                this.xn.user.sendSmsCode2(this.row.options.smsType);
            } else {
                // 发给validators里指定字段的手机号
                this.xn.user.sendSmsCode(mobile, this.row.options.smsType);
            }

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
