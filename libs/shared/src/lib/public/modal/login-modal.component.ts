import { switchMap } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../common/modal/components/modal';
import { XnUtils } from '../../common/xn-utils';
import { Observable, of } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { LoginSelectModalComponent } from './login-select-modal.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { ListHeadsFieldOutputModel, TabConfigModel } from '../../config/list-config-model';
import { ProjectManageAuth } from '../../config/angency-auth';
import XnLoginSwitchUtils from '../../common/xn-login-switch';
import * as md5 from 'js-md5';
import { CfcaLoginPreReadComponent } from './login-pre-read-modal.component';

@Component({
    selector: 'login-modal',
    templateUrl: './login-modal.component.html',
    styles: [
        `.login-sms-btn {
            height: 40px;
            width: 110px;
        }`,
        `.login-box-footer {
            padding-left: 10px;
            padding-right: 10px;
        }`,
        `.form-group {
            margin-bottom: 20px;
        }`,
        `.form-group:last-child {
            margin-bottom: 10px;
            margin-top: 40px;
        }`,
        `.form-control {
            height: 40px;
        }`
    ]
})
export class LoginModalComponent implements OnInit {

    private observer: any;
    alertMsg = '';
    btnText = '获取验证码';
    btnEnabled = true;
    time = 0;
    timer: any = null;
    processing = false;
    isNeedcode = false;
    code = '';
    @ViewChild('modal') modal: ModalComponent;

    constructor(private xn: XnService, private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,) {
    }

    ngOnInit() {
    }

    open(): Observable<any> {
        this.modal.open();
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    onLogin(accounts: string, code: string, password?: string): void {
        const account = accounts.replace(/[-]/g, '');
        if (XnUtils.isEmpty(account)) {
            this.alertMsg = '手机号码不能为空';
            return;
        }

        if (XnUtils.isEmpty(code)) {
            this.alertMsg = '短信验证码不能为空';
            return;
        }

        if (password !== undefined) {
            if (XnUtils.isEmpty(password)) {
                this.alertMsg = '密码不能为空';
                return;
            }
        }


        const afterCompleted = {
            next: (value) => {
                if (!value && value !== 2) {
                    return;
                }
                if (value === 2) {
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, CfcaLoginPreReadComponent, {}).subscribe(x => {
                        if (x && x.action === 'ok') {
                            this.xn.user.redirectConsole();
                        }
                    });
                }
                this.observer.next(value);
                this.observer.complete();
            },
            complete: () => {
                this.processing = false;

            }
        };

        this.alertMsg = '';
        this.processing = true;
        password = !password ? password : md5(password).toUpperCase();
        this.xn.user.login(account, code, password)
            .pipe(switchMap(json => {
                if (json.ret === 10112) {
                    this.xn.msgBox.open(false, json.msg, () => {
                        this.isNeedcode = true;
                        this.processing = false;

                    });
                    return of(null);
                } else {
                    return XnLoginSwitchUtils.switchModal(this.xn, this.vcr, json.data, this.localStorageService, json)
                }
            })).subscribe(afterCompleted);

    }

    onSend(accounts: string): void {
        const account = accounts.replace(/[-]/g, '');
        // 验证account
        if (XnUtils.isEmpty(account)) {
            this.alertMsg = '手机号码不能为空';
            return;
        }

        if (this.time <= 0) {
            // 发送事件
            this.xn.user.sendSmsCode(account, 1);

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
                    this.processing = false;
                } else {
                    this.btnText = `${this.time}秒后可重发`;
                }
            }, 1000);
            this.btnEnabled = false;
        }
    }

    /**
     * 中介机构登录设置权限
     * @param json 中介机构信息
     */
    setAgencyPermission(json: any) {
        // 保理商+11种中介机构
        if (![102, 3].includes(json.orgType)) {
            return '';
        }
        // let params = {
        //     appId: json.appId,
        //     agencyType: json.agencyType,
        // };
        // //调用接口获取权限配置
        // this.xn.dragon.post('/project_manage/agency/agency_info_list', { start: 0, length: 10 }).subscribe(res => {
        // if(res.ret === 0){
        // }
        // });
        this.localStorageService.caCheMap.delete('projectManageAuth');
        this.localStorageService.caCheMap.delete('agencyInfo');
        this.localStorageService.caCheMap.delete('agencyFilesAuth');
        this.localStorageService.setCacheValue('projectManageAuth', JSON.stringify(ProjectManageAuth.getAgencyConfig('allAgencyConfig')));
        this.localStorageService.setCacheValue('agencyInfo', JSON.stringify({ orgType: json.orgType, agencyType: json.agencyType }));
        this.localStorageService.setCacheValue('agencyFilesAuth', JSON.stringify(ProjectManageAuth.getAgencyConfig('agencyFilesConfig')));

    }
}
