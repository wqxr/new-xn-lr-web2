import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';

export default class DragonchangeCapitalTabConfig {
    static changeCapitalOne = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '19%' },
            { label: '资产编号', value: 'poolTradeCode', type: 'text', width: '10%' },
            { label: '项目公司', value: 'projectCompany', type: 'text', width: '10%' },
            { label: '收款单位', value: 'debtUnit', width: '10%' },
            { label: '基础合同名称', value: 'contractName', width: '10%' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '10%' },
            { label: '应收账款金额', value: 'receive', type: 'money', width: '10%' },
            { label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', width: '10%' },
        ] as ListHeadsFieldOutputModel[],
    };
}
