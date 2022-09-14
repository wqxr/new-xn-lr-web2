/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：平台角色列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-05-11
 * **********************************************************************
 */



export default class RoleType {
    static roleIdList = [
        { label: '管理员', value: 'admin' },
        { label: '经办人', value: 'operator' },
        { label: '复核人', value: 'reviewer' },
        { label: '客户经理经办人', value: 'customerOperator' },
        { label: '客户经理复核人', value: 'customerReviewer' },
        { label: '风险审查经办人', value: 'riskOperator' },
        { label: '风险审查复核人', value: 'riskReviewer' },
        { label: '财务经办人', value: 'financeOperator' },
        { label: '财务复核人', value: 'financeReviewer' },
        { label: '高管经办人', value: 'windOperator' },
        { label: '高管复核人', value: 'windReviewer' },
        { label: '查看权限', value: 'checkerLimit' },
    ];
    static getConfig() {
        return this.roleIdList;
    }
}
