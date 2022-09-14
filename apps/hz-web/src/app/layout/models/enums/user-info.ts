/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-factoring-cloud-web\apps\src\app\models\user-info.ts
 * @summary：init user-info.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-09-03
 ***************************************************************************/


export interface UserInfo {
    appId: string;
    appInfo: AppInfo;
    userId: string;
    userName: string;
    cardType: string;
    cardNo: string;
    mobile: string;
    email: string;
    roles: string[];
    isAdmin: boolean;

    isPlatformAdmin: boolean;
    customFlowIds: CustomFlowId[];
    isInvoice: number;

    appType: {
        type: number;
        subType: number;
        dcType: string;
    };
    enterpriseType: [];
    clientkey: string;
    loginTime: number;
    // modelId: EnumModels;

    orgType?: number;
    menuRoot: any;
    cloudMenuRoot: any;
}

export interface AppInfo {
    appName: string;
    status: number;
    appNature: number;
    bcUserAppId: string;
    bcUserAppKey: string;
    orgId: string;
    orgType: number;
    orgName: string;
    orgCodeType: string;
    orgCodeNo: string;
    extendInfo: string;
    orgLegalPerson: string;
    orgTelephone: string;
    orgEmail: string;
    orgRegisterAddress: string;
    orgAddress: string;
}

export interface CustomFlowId {
    appId: string;
    customFlowId: string;
    createTime: number;
    updateTime: number;
    orgType: OrderType;
}
export enum OrderType {
    /** 无排序 */
    none = 0,
    /** 升序 */
    asc = 1,
    /** 降序 */
    desc = -1,
}