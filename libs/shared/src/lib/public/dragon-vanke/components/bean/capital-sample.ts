import { ListHeadsFieldOutputModel } from '../../../../config/list-config-model';
import { CheckersOutputModel } from '../../../../config/checkers';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：项目管理-基础资产-抽样页面checker配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   yu             新增                 2020-01-17
 * **********************************************************************
 */



export default class CapitalSampleConfig {
    // 发起抽样页面
    static capitalSample = {
        checkers: [
            { title: '抽样资产池', checkerId: 'sampleCapital', type: 'special-text', required: false, value: '', name: 'sampleCapital', options: { } },
            { title: '抽样方式', checkerId: 'sampleType', type: 'sample-button', required: true, value: '', options: { } },
            { title: '抽样结果', checkerId: 'sampleResult', type: 'sample-result-list', required: true, value: '', options: { }, memo: '点击下载excel' },
            { title: '抽样结果汇总', checkerId: 'sampleResultCensus', type: 'special-text-array', required: false, value: '', options: {},
            childChecker: [
                    {title: '笔数', checkerId: 'capitalCount', type: 'special-text', required: false, value: '', placeholder: '上方交易笔数汇总'},
                    {title: '笔数占比', checkerId: 'capitalCountRatio', type: 'special-text', required: false, value: '', placeholder: '上方交易笔数汇总/资产池交易笔数'},
                    {title: '金额', checkerId: 'capitalSum', type: 'special-text', required: false, value: '', placeholder: '上方交易应收账款金额汇总'},
                    {title: '金额占比', checkerId: 'capitalSumRatio', type: 'special-text', required: false, value: '', placeholder: '上方交易应收账款金额汇总/资产池应收账款金额汇总'},
                ]
            },
        ] as CheckersOutputModel[]
    };

    // 业务详情checkers
    static businessDetails = {
        checkers: [
            { label: '交易ID', value: 'mainFlowId', type: 'text', data: ''},
            { label: '融资人区域', value: 'debtUnitProvince', type: 'text', data: ''},
            { label: '债务人区域', value: 'projectProvince', type: 'text', data: ''},
            { label: '核心企业内部区域', value: 'supplierCity', type: 'text', data: '' },
            { label: '合同类型', value: 'contractType', type: 'contractType', data: ''  }, // vankeContracttype
            { label: '付款确认书编号', value: 'payConfirmId', type: 'text', data: '' },
            // { label: '资产转让折扣率', value: 'discountRate', type: 'text', data: ''},
            { label: '渠道', value: 'type', type: 'text', data: ''},
            { label: '冻结', value: 'freezeOne', type: 'text', data: '' },
            { label: '预计放款日', value: 'priorityLoanDate', type: 'text', data: '' },
            { label: '实际放款日', value: 'realLoanDate', type: 'text', data: '' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'text', data: ''},
            { label: '总部提单日期', value: 'headPreDate', type: 'text', data: '' }
        ] as any[]
    };

    // 人工抽样列表
    static manualSampleList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: { sort: true, search: true }, show: true },
            { label: '收款单位', value: 'debtUnit', _inList: { sort: true, search: true }, show: true },
            { label: '申请付款单位', value: 'projectCompany', _inList: { sort: true, search: true }, show: true },
            { label: '融资人省份', value: 'debtSite', _inList: { sort: true, search: true }, show: true },
            { label: '债务人省份', value: 'projectSite', _inList: { sort: true, search: true }, show: true },
            { label: '核心企业内部区域', value: 'supplierCity', _inList: { sort: true, search: true }, show: true },
            { label: '合同类型', value: 'contractType', type: 'contractType', _inList: { sort: true, search: true }, show: true },
            { label: '应收账款金额', value: 'receive', type: 'receive', _inList: { sort: true, search: true }, show: true },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: { sort: true, search: true }, show: true },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1, show: true },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 2, show: true },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3, show: true },
            { title: '融资人省份', checkerId: 'debtSite', type: 'text', required: false, sortOrder: 4, show: true },
            { title: '债务人省份', checkerId: 'projectSite', type: 'text', required: false, sortOrder: 5, show: true },
            { title: '核心企业内部区域', checkerId: 'supplierCity', type: 'text', required: false, sortOrder: 7, show: true },
        ] as CheckersOutputModel[],
    };

    // 系统抽样列表
    static systemSampleList = {
        heads: [
            { label: '编号', value: 'number', type: 'ruleNo', _inList: { sort: true, search: true }, show: true },
            { label: '模型/规则名称', value: 'name', _inList: { sort: true, search: true }, show: true },
            { label: '类型', value: 'type', type: 'ruleType', _inList: { sort: true, search: true }, show: true }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '模型/规则名称', checkerId: 'ruleName', type: 'text', required: false, sortOrder: 1 }
        ] as CheckersOutputModel[],
    };

    // 抽样结果列表
    static sampleResult = {
        heads: [
            ...CapitalSampleConfig.manualSampleList.heads,
            { label: '付款确认书编号', value: 'payConfirmId', _inList: { sort: true, search: true }, show: true },
            // { label: '资产转让折扣率', value: 'discountRate', type: 'number', _inList: { sort: true, search: true }, show: true },
            { label: '交易状态', value: 'flowId', type: 'flowId', _inList: { sort: true, search: true }, show: true },
            { label: '业务类型', value: 'type', type: 'channel', _inList: { sort: true, search: true }, show: true },
        ] as ListHeadsFieldOutputModel[]
    };

    /**
     * 给checkes赋值
     */
    static setValue(params: {[key: string]: any}): any{
        CapitalSampleConfig.capitalSample.checkers.forEach((obj) => {
            if (params.hasOwnProperty(obj.checkerId)){
                obj.value = params[obj.checkerId];
            }
        });
        return CapitalSampleConfig.capitalSample;
    }

    static getConfig(name: string, type: string){
        return CapitalSampleConfig[name][type];
    }
}
