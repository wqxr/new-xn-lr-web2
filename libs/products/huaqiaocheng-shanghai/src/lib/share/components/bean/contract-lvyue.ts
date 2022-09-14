/*
 * @Description: 交易合同、履约证明配置
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-11-06 10:04:23
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-11-10 09:19:07
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\share\components\bean\contract-lvyue.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */

export class ContractLvyueConfig {
    // 交易合同
    static platContract = {
        heads: [
            { label: '合同编号', value: 'contractId', width: '23%' },
            { label: '合同名称', value: 'contractName', width: '18%' },
            { label: '合同金额', value: 'contractMoney', type: 'money', width: '14%' },
            { label: '合同类型', value: 'contractType', type: 'contractType', width: '13%' },
            { label: '合同扫描件', value: 'contractFile', type: 'files', width: '24%' },
        ],
    };
    // 履约证明
    static lvyue = {
        dragon_platform_verify: {
            heads: [
                { label: '文件', value: 'performanceFile', type: 'files', width: '52%' },
                { label: '累计确认产值', value: 'totalReceive', type: 'money', width: '40%' },
            ],
        },
        default: {
            heads: [
                { label: '文件', value: 'performanceFile', type: 'files', width: '29%' },
                { label: '本次产值金额', value: 'percentOutputValue', type: 'money', width: '20%' },
                { label: '本次付款性质', value: 'payType', type: 'payType', width: '15%' },
                { label: '累计确认产值', value: 'totalReceive', type: 'money', width: '20%' },
            ],
        },
    };

    // 文件上传checkers
    static fileUpCheckers = [{
        title: '交易合同文件上传',
        name: 'contractUpload',
        checkerId: 'contractUpload',
        type: 'dragonMfile',
        required: 1,
        value: '',
        options: {filename: '交易合同', fileext: 'jpg, jpeg, png,pdf', picSize: 500},
    }];

    /**
     * @description: 获取配置
     * @param {string} name
     * @return {*}
     */
    static getConfig(name: string): {[key: string]: any} {
        return ContractLvyueConfig[name];
    }

    /**
     * @description: 获取履约证明表头
     * @param {string} name
     * @param {string} flowId
     * @return {*}
     */
    static getLvYue(name: string, flowId: string = ''): {[key: string]: any} {
        const flowKey = ['dragon_platform_verify'].includes(flowId) ? flowId : 'default';
        return ContractLvyueConfig[name][flowKey];
    }
}
export interface ContractInfo {
    // 合同查看checkers字段--------------
    // 合同编号
    contractId: string;
    // 合同金额
    contractMoney: string | number;
    // 合同名称
    contractName: string;
    // 合同类型
    contractType: string | number;
    // 收款单位
    debtUnit: string;
    // 收款单位账号
    debtUnitAccount: string;
    // 收款单位开户行
    debtUnitBank: string;
    // 收款单位户名
    debtUnitName: string;
    // 申请付款单位
    projectCompany: string;
    // 应收账款金额
    receive: string | number;
    // 合同签订时间
    signTime: string;
    // 累计确认产值
    totalReceive: string | number;
    // 付款比例
    payRate: string | number;
    // 基础合同甲方名称
    contractJia: string;
    // 基础合同乙方名称
    contractYi: string;
    // 本次产值金额
    percentOutputValue: string | number;
    // 本次付款性质
    payType: string;
    // 交易合同列表序号
    index?: string | number;
    // 交易合同
    contractFile?: any[] | string;
    // 交易合同扫描件列表
    inputFile?: any[] | string;
    // 履约证明文件
    performanceFile?: any[];
    // ------------------------------
    // 万科原始数据款项类型--万科数据对接
    feeTypeName?: string;
    // 区分0万科、1万科数据对接
    wkType?: string | number;
    // 渠道类型 1 2 99
    type?: string | number;
}
