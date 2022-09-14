
/*
 * Copyright(c) 2017-2021, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：TableHeadConfig
 * @summary：excel 解析数据列表配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-09
 * **********************************************************************
 */

export default class TableHeadConfig {
    static heads = {
        雅居乐提单: {
            雅居乐地产控股有限公司: {
                headText: [
                    { label: '应付账款序号', value: 'num' },
                    { label: '总部公司', value: 'headquarters' },
                    { label: '申请付款单位', value: 'projectCompany' },
                    { label: '项目名称', value: 'projectName' },
                    { label: '付款确认书编号', value: 'payConfirmId' },
                    { label: '合同号', value: 'contractId' },
                    // {label: '合同名称', value: 'contractName'},
                    { label: '发票号', value: 'invoiceNum', options: { type: 'multiple' } },
                    { label: '发票金额', value: 'invoiceAmount', options: { type: 'money' } },
                    { label: '应付账款金额', value: 'receivable', options: { type: 'money' } },
                    { label: '收款单位', value: 'debtUnit' },
                    { label: '收款单位账号', value: 'debtAccount' },
                    { label: '收款单位开户行', value: 'debtBank' },
                    { label: '联系人', value: 'debtUser', options: { type: 'multiple' } },
                    { label: '联系人手机号', value: 'debtUserMobile', options: { type: 'multiple' } },
                    { label: '应收账款受让方', value: 'receivableAssignee' },
                    { label: '受让价格', value: 'assigneePrice' },
                    // {label: '转让价款', value: 'changePrice'},
                    // {label: '确认书出具日期', value: 'confirmationIssuanceTime'},
                    // {label: '确认书到期日期', value: 'confirmationExpiryTime'},
                    { label: '保理联系人', value: 'factoringUser' },
                    { label: '保理联系人手机号', value: 'factoringUserMobile' },
                    // {label: '是否需要更正', value: 'correct', options: {type: 'def', style: 'red'}},
                    { label: '是否注册', value: 'registered', options: { type: 'boolean', style: 'red' } },
                ],
                excel_down_url: '/assets/lr/doc/vanke-mode/提单模板：万科模式应收账款保理计划表-雅居乐.xlsx',
                excel_up_url: '/ljx/dc_project/order_check',
            },
            雅居乐集团控股有限公司: {
                // 星顺、恒泽
                headText: [
                    { label: '序号', value: 'index' },
                    { label: '区域', value: 'projectCity' },
                    { label: '申请付款单位', value: 'projectCompany' },
                    { label: '付款确认书编号', value: 'payConfirmId' },
                    { label: '合同号', value: 'contractId' },
                    {label: '合同名称', value: 'contractName'},
                    { label: '应付账款金额', value: 'receive', options: { type: 'money' } },
                    { label: '应收账款债权人', value: 'debtUnit' },
                    { label: '收款单位户名', value: 'debtUnitName' },
                    { label: '收款账号', value: 'debtUnitAccount' },
                    { label: '收款单位开户行', value: 'debtUnitBank' },
                    { label: '受让价格', value: 'discountRate' },
                    { label: '运营联系人', value: 'operatorName' },
                    { label: '运营联系人手机号', value: 'operatorPhone' },
                ],
                excel_down_url: '/assets/lr/doc/agile-hz/雅居乐系统录入提单信息.xlsx',
                excel_up_url: '/pay_plan/yjl_upload_excel',
            },
        },
    };

    static getConfig(name: string) {
        return this.heads[name];
    }
}
