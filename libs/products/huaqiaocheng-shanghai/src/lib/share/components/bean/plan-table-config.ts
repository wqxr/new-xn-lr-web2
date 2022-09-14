
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
        // 华侨城-上海银行 提单
        shanghai: {
            深圳华侨城股份有限公司: {
                headText: [
                    { label: '应收账款序号', value: 'index' },
                    { label: '总部公司', value: 'headquarters' },
                    { label: '申请付款单位', value: 'projectCompany' },
                    { label: '合同编号', value: 'contractId' },
                    { label: '合同名称', value: 'contractName' },
                    { label: '预录入发票号码', value: 'preInvoiceNum', options: { type: 'multiple' } },
                    { label: '预录入发票金额', value: 'preInvoiceAmount', options: { type: 'money' } },
                    { label: '应收账款金额', value: 'receive', options: { type: 'money' } },
                    { label: '服务费率', value: 'serviceRate', options: { type: 'rate' } },
                    { label: '收款单位', value: 'debtUnit' },
                    { label: '收款单位账号', value: 'debtUnitAccount' },
                    { label: '收款单位开户行', value: 'debtUnitBank' },
                    { label: '运营部对接人', value: 'operatorName' },
                    { label: '市场部对接人', value: 'marketName' },
                    { label: '城市公司', value: 'cityCompany' },
                ],
                excel_down_url: '/assets/lr/doc/oct-sh-mode/华侨城-上海银行付款计划表.xlsx',
                excel_up_url: '/pay_plan/shOctUploadExcel',
            }
        }
    };

    static getConfig(name: string) {
        return this.heads[name];
    }
}
