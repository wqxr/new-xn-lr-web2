
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：PlanTableConfig
 * @summary：应收账款保理计划列表配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          添加注释         2019-04-09
 * **********************************************************************
 */

export default class PlanTableConfig {
    static heads = {
        // 上海银行 提单
        shanghai: {
            sh_vanke_financing_pre: {
                headText: [
                    { label: '应收账款序号', value: 'index' },
                    { label: '总部公司', value: 'headquarters' },
                    { label: '申请付款单位', value: 'projectCompany' },
                    { label: '项目名称', value: 'projectName' },
                    { label: '付款确认书编号', value: 'payConfirmId' },
                    { label: '合同编号', value: 'contractId' },
                    { label: '合同名称', value: 'contractName' },
                    { label: '预录入发票号码', value: 'preInvoiceNum', options: { type: 'multiple' } },
                    { label: '预录入发票金额', value: 'preInvoiceAmount', options: { type: 'money' } },
                    { label: '应收账款金额', value: 'receive', options: { type: 'money' } },
                    { label: '融资利率', value: 'discountRate', options: { type: 'rate' } },
                    { label: '服务费率', value: 'serviceRate', options: { type: 'rate' } },
                    { label: '确认书出具日期', value: 'qrsProvideTime', options: { type: 'date' } },
                    { label: '保理融资到期日', value: 'factoringEndDate', options: { type: 'date' } },
                    { label: '收款单位', value: 'debtUnit' },
                    { label: '收款单位账号', value: 'debtUnitAccount' },
                    { label: '收款单位开户行', value: 'debtUnitBank' },
                    { label: '联系人', value: 'linkMan' },
                    { label: '联系人手机号', value: 'linkPhone' },
                    { label: '应收账款受让方', value: 'factoringOrgName' },
                    { label: '运营部对接人', value: 'operatorName' },
                    { label: '运营部对接人手机号', value: 'operatorPhone' },
                    { label: '市场部对接人', value: 'marketName' },
                    { label: '市场部对接人手机号', value: 'marketPhone' },
                    { label: '申请付款单位归属城市', value: 'projectCity' },
                    // { label: '申请付款单位省份', value: 'projectProvince' },
                    { label: '收款单位是否注册', value: 'isRegisterSupplier', options: { type: 'boolean', style: 'red' } },
                    // { label: '托管行', value: 'depositBank' },
                    { label: '总部提单日期', value: 'headPreDate', options: { type: 'date' } },
                ],
                excel_down_url: '',
                excel_up_url: '',
            }
        }
    };

    static getConfig(name: string) {
        return this.heads[name];
    }
}
