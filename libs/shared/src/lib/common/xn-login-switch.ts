import { ViewContainerRef } from '@angular/core';
import { XnModalUtils } from '../common/xn-modal-utils';
import { LoginSelectModalComponent } from '../public/modal/login-select-modal.component';
import { Observable, of } from 'rxjs';
import { XnService } from '../services/xn.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ProjectManageAuth } from '../config/angency-auth';
import { NzDemoModalBasicComponent } from '../public/modal/cfca-result-modal.component';
import { CfcaLoginPreReadComponent } from '../public/modal/login-pre-read-modal.component';
import { RegisterFlowType, RegisterRouterUrl } from '../config/enum';

interface AccountInfo {
    multiOrgs: {
        accountId: string;
        accountType: number;
        appId: string;
        orgName: string;
        orgType: number;
        userId: string;
        valid: number;
        status?: number;
        cacheKey?: string;
        memo?: string;
        /** 注册类型 0 默认 1保函通 */
        registerType: string | number;
    }[];
    modelId?: string;
    tmpToken: string;
    logined?: boolean;
    mustReadProtocol?: boolean;

}

/**
 * 登录机构/业务模式选择
 */
export default class XnLoginSwitchUtils {

    /**
    * 1. 平台不需要选择模式
    * 2. 若包含有 雅居乐-星顺 模式，则弹框选择业务模式
    * 3. 跳转到首页
    */
    static switchModal(
        xn: XnService,
        vcr: ViewContainerRef,
        loginInfo: AccountInfo,
        localStorageService?: LocalStorageService,
        info?: any,

    ) {
        return Observable.create((observer) => {
            const next = (value) => {
                observer.next(value);
                observer.complete();
            };
            if (loginInfo.multiOrgs && loginInfo.multiOrgs.length > 0) {
                if (loginInfo.multiOrgs.length === 1 && !!loginInfo.multiOrgs[0].cacheKey) {
                    // window.sessionStorage.setItem('cacheKey', loginInfo.multiOrgs[0].cacheKey);

                    if (loginInfo.multiOrgs[0].status === 6) {
                        const successinfo = {
                            title: '提示',
                            okButton: '确定',
                            cancelButton: null,
                            img: '',
                            info: '注册审核中，请等待...',
                            reason: '',
                            text: '如有疑问，请联系平台运营人员，电话：0755-29966132',
                        };
                        XnModalUtils.openInViewContainer(xn, vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {
                        });
                    } else if (loginInfo.multiOrgs[0].status === 2) {
                        const successinfo = {
                            title: '提示',
                            okButton: '确定',
                            cancelButton: null,
                            img: '',
                            info: '注册不通过',
                            reason: '审核拒绝原因：非本公司业务合作企业',
                            text: '如有疑问，请联系平台运营人员，电话：0755-29966132',
                        };
                        XnModalUtils.openInViewContainer(xn, vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {
                        });
                    } else {
                        loginInfo.multiOrgs[0].memo = loginInfo.multiOrgs[0].memo ? loginInfo.multiOrgs[0].memo : '';
                        if(String(loginInfo.multiOrgs[0].registerType) === String(RegisterFlowType.PatternWithGuaranteeAgency)) {
                            window.open(
                                `${window.location.origin}${RegisterRouterUrl[RegisterFlowType[Number(loginInfo.multiOrgs[0].registerType)]]}?
                                step=${loginInfo.multiOrgs[0].status}&cacheKey=${loginInfo.multiOrgs[0].cacheKey}&memo=${loginInfo.multiOrgs[0].memo}`,
                                '_self'
                            );
                        } else {
                            xn.router.navigate([`${RegisterRouterUrl[RegisterFlowType[Number(loginInfo.multiOrgs[0].registerType)]]}`],
                            {
                                queryParams:
                                {
                                    step: loginInfo.multiOrgs[0].status,
                                    cacheKey: loginInfo.multiOrgs[0].cacheKey,
                                    memo: loginInfo.multiOrgs[0].memo
                                }
                            });
                            // xn.router.navigate([`/newuser/register`], { queryParams: { step: loginInfo.multiOrgs[0].status } });
                        }
                    }
                    return;
                }
                XnModalUtils.openInViewContainer(
                    xn,
                    vcr,
                    LoginSelectModalComponent,
                    loginInfo
                ).subscribe((v) => {
                    if (v.action === 'ok') {
                        if (v.modelId) {
                            window.sessionStorage.setItem('modelId', v.modelId);
                        }

                        const after = {
                            next: (v) => {
                                this.setAgencyPermission(localStorageService, v);
                                xn.user.redirectConsole();
                            },
                            complete: () => next(1)
                        };
                        // 选择了机构，再次发送
                        xn.user
                            .tmpLogin(
                                v.appId,
                                v.orgType,
                                loginInfo.tmpToken,
                                v.factorAppId,
                                v.agencyType,
                                v.modelId
                            )
                            .subscribe(after);
                    } else if (v.action === 'yes') {
                        if (v.step === 6) {
                            const successinfo = {
                                title: '提示',
                                okButton: '确定',
                                cancelButton: null,
                                img: '',
                                info: '注册审核中，请等待...',
                                text: '如有疑问，请联系平台运营人员，电话：0755-29966132',
                            };
                            const params: any = {
                            };
                            XnModalUtils.openInViewContainer(xn, vcr, NzDemoModalBasicComponent, successinfo).subscribe(x => {

                            });
                        } else {
                            v.memo = v.memo ? v.memo : '';
                            let _registerType = loginInfo.multiOrgs?.find((x: any) => String(x.appId) === String(v.appId))?.registerType;
                            if(String(_registerType) === String(RegisterFlowType.PatternWithGuaranteeAgency)) {
                                window.open(
                                    `${window.location.origin}${RegisterRouterUrl[RegisterFlowType[Number(_registerType)]]}?step=${v.step}&cacheKey=${v.cacheKey}`,
                                    '_self'
                                );
                            } else {
                                xn.router.navigate([`${RegisterRouterUrl[RegisterFlowType[Number(_registerType)]]}`],
                                    { queryParams: { step: v.step, memo: v.memo, cacheKey: v.cacheKey } });
                            }
                        }
                    } else if (v && v.action === 'read') { // 手动开户的公司需要阅读协议
                        if (v.modelId) {
                            window.sessionStorage.setItem('modelId', v.modelId);
                        }

                        const after = {
                            next: (v) => {
                                this.setAgencyPermission(localStorageService, v);
                            },
                            complete: () => next(2)
                        };
                        // 选择了机构，再次发送
                        xn.user
                            .tmpLogin(
                                v.appId,
                                v.orgType,
                                loginInfo.tmpToken,
                                v.factorAppId,
                                v.agencyType,
                                v.modelId
                            )
                            .subscribe(after);
                    } else {
                        next(1);
                    }
                });
            } else {
                if (loginInfo.mustReadProtocol) {
                    this.setAgencyPermission(localStorageService, info);
                    next(2);
                } else if (loginInfo.modelId) {
                    window.sessionStorage.setItem('modelId', loginInfo.modelId);
                    this.setAgencyPermission(localStorageService, info);
                    xn.user.redirectConsole();
                    next(1);

                }

            }
        });
    }
    /**
    * 中介机构登录设置权限
    * @param json 中介机构信息
    */
    static setAgencyPermission(localStorageService: LocalStorageService, json: any) {
        // 保理商+11种中介机构
        if (!json || !json.orgType || ![102, 3].includes(json.orgType)) {
            return '';
        }
        // let params = {
        //     appId: json.appId,
        //     agencyType: json.agencyType,
        // };
        // //调用接口获取权限配置
        // this.xn.dragon.post('/project_manage/agency/agency_info_list', { start: 0, length: 10 }).subscribe(res => {
        //     if(res.ret === 0){
        //     }
        // });
        localStorageService.caCheMap.delete('projectManageAuth');
        localStorageService.caCheMap.delete('agencyInfo');
        localStorageService.caCheMap.delete('agencyFilesAuth');
        localStorageService.setCacheValue('projectManageAuth', JSON.stringify(ProjectManageAuth.getAgencyConfig('allAgencyConfig')));
        localStorageService.setCacheValue('agencyInfo', JSON.stringify({ orgType: json.orgType, agencyType: json.agencyType }));
        localStorageService.setCacheValue('agencyFilesAuth', JSON.stringify(ProjectManageAuth.getAgencyConfig('agencyFilesConfig')));
    }
}
