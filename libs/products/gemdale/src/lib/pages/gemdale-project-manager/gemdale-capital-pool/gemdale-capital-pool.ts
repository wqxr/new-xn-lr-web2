import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ProjectManageAuth } from 'libs/shared/src/lib/config/angency-auth';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';


/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：资产池项目管理
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq             新增                 2020-01-17
 * **********************************************************************
 */

export default class ProjectManagerCapitalList {
    // 基础资产列表 -默认配置
    static basicCapitalList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: { sort: true, search: true }, show: true },
            { label: '收款单位', value: 'debtUnit', _inList: { sort: true, search: true }, show: true },
            { label: '申请付款单位', value: 'projectCompany', _inList: { sort: true, search: true }, show: true },
            { label: '融资人区域', value: 'debtSite', _inList: { sort: true, search: true }, show: true },
            { label: '债务人区域', value: 'projectSite', _inList: { sort: true, search: true }, show: true },
            { label: '核心企业内部区域', value: 'supplierCity', _inList: { sort: false, search: true }, show: true },
            { label: '付款确认书编号', value: 'payConfirmId', _inList: { sort: true, search: true }, show: true },
            { label: '应收账款金额', value: 'receive', type: 'receive', _inList: { sort: true, search: true }, show: true },
            { label: '资产转让折扣率', value: 'discountRate', type: 'number', _inList: { sort: true, search: true }, show: true },
            { label: '交易状态', value: 'flowId', type: 'currentStep', _inList: { sort: true, search: true }, show: true },
            { label: '合同类型', value: 'contractType', type: 'tradeType', _inList: { sort: true, search: true }, show: true },
            { label: '是否冻结', value: 'freeze', type: 'freezing', show: true },
            { label: '资产编号', value: 'poolTradeCode', show: true },
            { label: '上传发票与预录入是否一致', value: 'isInvoiceFlag', type: 'invoiceFlag', _inList: { sort: true, search: true }, show: true },
            { label: '预计放款日', value: 'priorityLoanDate', type: 'date', _inList: { sort: true, search: true }, show: true },
            { label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: { sort: true, search: true }, show: true },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: { sort: true, search: true }, show: true },
            { label: '是否关联企业', value: 'isRelationCompany', type: 'isRelationCompany', _inList: { sort: false, search: true }, show: true },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1, show: true },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 2, show: true },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3, show: true },
            { title: '融资人区域', checkerId: 'debtSite', type: 'text', required: false, sortOrder: 4, show: true },
            { title: '债务人区域', checkerId: 'projectSite', type: 'text', required: false, sortOrder: 5, show: true },
            { title: '资产编号', checkerId: 'poolTradeCode', type: 'text', required: false, sortOrder: 6, show: true },
            { title: '交易状态', checkerId: 'flowId', type: 'select', options: { ref: '' }, required: false, sortOrder: 7, show: true },
            { title: '合同类型', checkerId: 'contractType', type: 'select', base: 'number', options: { ref: '' }, required: false, sortOrder: 8, show: true },
            { title: '是否冻结', checkerId: 'freeze', type: 'select', base: 'number', options: { ref: 'freezing' }, required: false, sortOrder: 9, show: true },
            { title: '实际上传发票与预录入是否一致', checkerId: 'isInvoiceFlag', base: 'number', type: 'select', options: { ref: 'defaultRadio' }, required: false, sortOrder: 10, show: true },
            { title: '总部提单日期', checkerId: 'isHeadPreDate', type: 'machine-loandate', required: false, sortOrder: 11, show: true },

            { title: '是否关联企业', checkerId: 'isRelationCompany', base: 'number', type: 'select', options: { ref: 'defaultRadio' }, required: false, sortOrder: 12, show: true },
            { title: '核心企业内部区域', checkerId: 'supplierCity', type: 'text', required: false, sortOrder: 13, show: true },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 14, show: true },
        ] as CheckersOutputModel[]
    };

    // 交易文件列表 -默认配置
    static transactionFileList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', show: true },
            { label: '收款单位', value: 'debtUnit', show: true },
            { label: '申请付款单位', value: 'projectCompany', show: true },
            { label: '融资人区域', value: 'debtSite', _inList: { sort: true, search: true }, show: true },
            { label: '债务人区域', value: 'projectSite', _inList: { sort: true, search: true }, show: true },
            { label: '核心企业内部区域', value: 'supplierCity', _inList: { sort: false, search: true }, show: true },
            { label: '应收账款金额', value: 'receive', type: 'receive', show: true },
            { label: '交易状态', value: 'flowId', type: 'currentStep', show: true },
            { label: '付款确认书', value: 'factoringPayConfirmYyj', type: 'file', show: true },
            { label: '其他文件', value: 'otherFile', type: 'file', show: true },
            { label: '推送企业次数', value: 'pushCount', show: true },
            { label: '资产编号', value: 'poolTradeCode', show: true },
            { label: '项目公司是否退回', value: 'returnBack', type: 'returnBack', show: true },
            { label: '是否关联企业', value: 'isRelationCompany', type: 'isRelationCompany', show: true },
            { label: '是否冻结', value: 'freeze', type: 'freezing', show: true },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1, show: true },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 2, show: true },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3, show: true },
            { title: '融资人区域', checkerId: 'debtSite', type: 'text', required: false, sortOrder: 4, show: true },
            { title: '债务人区域', checkerId: 'projectSite', type: 'text', required: false, sortOrder: 5, show: true },
            { title: '资产编号', checkerId: 'poolTradeCode', type: 'text', required: false, sortOrder: 6, show: true },
            { title: '交易状态', checkerId: 'flowId', type: 'select', options: { ref: '' }, required: false, sortOrder: 7, show: true },
            { title: '合同类型', checkerId: 'type', type: 'select', options: { ref: '' }, required: false, sortOrder: 8, show: true },
            { title: '是否冻结', checkerId: 'freeze', type: 'select', options: { ref: 'freezing' }, required: false, sortOrder: 9, show: true },
            { title: '《付款确认书》', checkerId: 'statusFactoringPayConfirm', type: 'select', required: false, sortOrder: 14, show: true, options: { ref: 'vankeSelectFlag2' } },
            { title: '其他文件', checkerId: 'otherFile', type: 'text', required: false, sortOrder: 15, show: true },
            { title: '推送企业次数', checkerId: 'pushCount', type: 'select', options: { ref: 'pushCount' }, required: false, sortOrder: 16, show: true },
            { title: '总部提单日期', checkerId: 'beforeDate', type: 'quantum1', required: false, sortOrder: 17, show: true },

            { title: '是否关联企业', checkerId: 'isRelationCompany', base: 'number', type: 'select', options: { ref: 'defaultRadio' }, required: false, sortOrder: 18, show: true },
            { title: '核心企业内部区域', checkerId: 'supplierCity', type: 'text', required: false, sortOrder: 19, show: true },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 20, show: true },
        ] as CheckersOutputModel[]
    };

    // 尽职调查列表 -默认配置
    static dueDiligenceList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: { sort: true, search: true }, show: true },
            { label: '收款单位', value: 'debtUnit', _inList: { sort: true, search: true }, show: true },
            { label: '申请付款单位', value: 'projectCompany', _inList: { sort: true, search: true }, show: true },
            { label: '融资人区域', value: 'debtSite', _inList: { sort: true, search: true }, show: true },
            { label: '债务人区域', value: 'projectSite', _inList: { sort: true, search: true }, show: true },
            { label: '核心企业内部区域', value: 'supplierCity', _inList: { sort: false, search: true }, show: true },
            // { label: '资产编号', value: 'poolTradeCode', show: true },
            { label: '合同类型', value: 'contractType', type: 'tradeType', _inList: { sort: true, search: true }, show: true },
            { label: '应收账款金额', value: 'receive', type: 'receive', _inList: { sort: true, search: true }, show: true },
            { label: '交易状态', value: 'flowId', type: 'currentStep', _inList: { sort: true, search: true }, show: true },
            { label: '是否关联企业', value: 'isRelationCompany', type: 'isRelationCompany', show: true },
            { label: '抽样时间', value: 'sampleTime', type: 'datetime', show: true },
            { label: '律所尽调状态', value: 'lawSurveyStatus', type: 'surveyStatus', show: true },
            { label: '律所尽调意见', value: 'lawSurveyAdvise', type: 'surveyInfo', show: true },
            { label: '管理人尽调状态', value: 'managerSurveyStatus', type: 'surveyStatus', show: true },
            { label: '管理人尽调意见', value: 'managerSurveyAdvise', type: 'surveyInfo', show: true },

        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1, show: true },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 2, show: true },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3, show: true },
            { title: '融资人区域', checkerId: 'debtSite', type: 'text', required: false, sortOrder: 4, show: true },
            { title: '债务人区域', checkerId: 'projectSite', type: 'text', required: false, sortOrder: 5, show: true },
            { title: '资产编号', checkerId: 'poolTradeCode', type: 'text', required: false, sortOrder: 6, show: true },
            { title: '交易状态', checkerId: 'flowId', type: 'select', options: { ref: '' }, required: false, sortOrder: 7, show: true },
            { title: '合同类型', checkerId: 'contractType', type: 'select', options: { ref: '' }, required: false, sortOrder: 8, show: true },
            { title: '尽调状态', checkerId: 'surveyStatus', type: 'multiselect', options: { ref: 'allSurveyStatus' }, required: false, sortOrder: 9, show: true },

            { title: '是否关联企业', checkerId: 'isRelationCompany', base: 'number', type: 'select', options: { ref: 'defaultRadio' }, required: false, sortOrder: 10, show: true },
            { title: '核心企业内部区域', checkerId: 'supplierCity', type: 'text', required: false, sortOrder: 11, show: true },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 12, show: true },
        ] as CheckersOutputModel[]
    };

    // 特殊资产列表 -默认配置
    static specialCapitalList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: { sort: true, search: true }, show: true },
            { label: '收款单位', value: 'debtUnit', _inList: { sort: true, search: true }, show: true },
            { label: '申请付款单位', value: 'projectCompany', _inList: { sort: true, search: true }, show: true },
            { label: '融资人区域', value: 'debtSite', _inList: { sort: true, search: true }, show: true },
            { label: '债务人区域', value: 'projectSite', _inList: { sort: true, search: true }, show: true },
            { label: '应收账款金额', value: 'receive', type: 'receive', _inList: { sort: true, search: true }, show: true },
            { label: '交易状态', value: 'flowId', type: 'currentStep', _inList: { sort: true, search: true }, show: true },
            { label: '资产编号', value: 'poolTradeCode', show: true },
            { label: '是否关联企业', value: 'isRelationCompany', type: 'isRelationCompany', show: true },
            { label: '特殊资产标记', value: 'isSpecialAsset', type: 'specialCapitalMark', show: true },
            { label: '赎回/回购价格', value: 'redeemReceive', type: 'receive', show: true },
            { label: '处置状态', value: 'disposeStatus', type: 'disposalStatus', show: true },

        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1, show: true },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 2, show: true },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 3, show: true },
            { title: '融资人区域', checkerId: 'debtSite', type: 'text', required: false, sortOrder: 4, show: true },
            { title: '债务人区域', checkerId: 'projectSite', type: 'text', required: false, sortOrder: 5, show: true },
            { title: '资产编号', checkerId: 'poolTradeCode', type: 'text', required: false, sortOrder: 6, show: true },
            { title: '交易状态', checkerId: 'flowId', type: 'select', options: { ref: '' }, required: false, sortOrder: 7, show: true },
            { title: '核心企业内部区域', checkerId: 'supplierCity', type: 'text', required: false, sortOrder: 8, show: true },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 9, show: true },
            { title: '是否关联企业', checkerId: 'isRelationCompany', base: 'number', type: 'select', options: { ref: 'defaultRadio' }, required: false, sortOrder: 10, show: true },
            { title: '特殊资产标记', checkerId: 'isSpecialAsset', base: 'number', type: 'select', options: { ref: 'specialCapitalMark' }, required: false, sortOrder: 11, show: true },
            { title: '处置状态', checkerId: 'disposeStatus', base: 'number', type: 'select', options: { ref: 'disposalStatus' }, required: false, sortOrder: 12, show: true },
        ] as CheckersOutputModel[]
    };

    // 业务详情checkers
    static businessDetails = {
        checkers: [
            { label: '交易ID', value: 'mainFlowId', type: 'text', data: '' },
            { label: '融资人区域', value: 'debtUnitProvince', type: 'text', data: '' },
            { label: '债务人区域', value: 'projectProvince', type: 'text', data: '' },
            { label: '核心企业内部区域', value: 'supplierCity', type: 'text', data: '' },
            { label: '合同类型', value: 'contractType', type: 'contractType', data: '' }, // vankeContracttype
            { label: '付款确认书编号', value: 'payConfirmId', type: 'text', data: '' },
            { label: '资产转让折扣率', value: 'discountRate', type: 'text', data: '' },
            { label: '渠道', value: 'type', type: 'text', data: '' },
            { label: '冻结', value: 'freezeOne', type: 'text', data: '' },
            { label: '预计放款日', value: 'priorityLoanDate', type: 'text', data: '' },
            { label: '实际放款日', value: 'realLoanDate', type: 'text', data: '' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'text', data: '' },
            { label: '总部提单日期', value: 'headPreDate', type: 'text', data: '' }
        ] as any[],
    };

    // 交易变动记录
    static transactionChangesconfig = {
        searches: {
            title: '交易变动记录',
            get_url: '/project_manage/pool/trade_change_list',
            get_type: 'dragon',
            multiple: null,
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
                { label: '操作记录', value: 'operateId', type: 'operateId' },
                { label: '操作时间', value: 'time', type: 'date' },
                { label: '操作人', value: 'operateUserName' }
            ],
            searches: [
                { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
                { title: '操作记录', checkerId: 'operateId', type: 'select', options: { ref: 'operateType' }, required: false, sortOrder: 2 },
                { title: '操作人', checkerId: 'operateUserName', type: 'text', required: false, sortOrder: 2 }
            ],
            key: 'mainFlowId'
        }
    };

    /**
     * 基础资产表头和搜索项配置
     */
    static headSearches = {
        A: {
            DOING: ProjectManagerCapitalList.basicCapitalList
        },
        B: {
            DOING: ProjectManagerCapitalList.transactionFileList
        },
        C: {
            DOING: ProjectManagerCapitalList.dueDiligenceList
        },
        E: {
            DOING: ProjectManagerCapitalList.specialCapitalList
        },
    };

    /**
     * 根据name获取配置
     * @param name
     */
    static getConfig(name: string) {
        return ProjectManagerCapitalList[name];
    }

    /***
     *  获取页面配置项
     *  @param localStorageService 存储服务
     *  @param xn 通用服务
     *  @param listName 列表名称
     */
    static getTabConfig(localStorageService: any, xn: any, listName: string): any {
        const projectManageAuthMap = localStorageService.caCheMap.get('projectManageAuth');
        const agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
        const agencySession = { orgType: Number(window.sessionStorage.getItem('orgType')), agencyType: Number(window.sessionStorage.getItem('agencyType')) };
        // console.log("projectManageAuth==", projectManageAuthMap, agencyInfoMap, agencySession);
        let tabConfig: TabConfigModel = new TabConfigModel();
        const projectManageAuth = !!projectManageAuthMap ? JSON.parse(projectManageAuthMap) : XnUtils.deepCopy(ProjectManageAuth.allAgencyConfig, {});
        const agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
        tabConfig = projectManageAuth[listName];
        tabConfig.level = 0;
        tabConfig[LevelEnum[0]] = ProjectManagerCapitalList.filterAuth(tabConfig[LevelEnum[0]], agencyInfo, LevelEnum[0], 0);
        // console.log("config===", tabConfig);
        return tabConfig;
    }

    /**
     * 递归过滤配置对象
     * @param authInfo
     * @param agencyInfo
     */
    static filterAuth(authInfo: any, agencyInfo: { orgType: number | string, agencyType: number | string }, nodeName: string, level: number) {
        if (Object.prototype.toString.call(authInfo) === '[object Object]') {
            for (const key of Object.keys(authInfo)) {
                authInfo[key] = ProjectManagerCapitalList.filterAuth(authInfo[key], agencyInfo, key, level);
            }
            return authInfo;
        } else if (Object.prototype.toString.call(authInfo) === '[object Array]') {
            return authInfo.filter((tabObj: any) => {
                return tabObj.agencyTypeList.includes(Number(agencyInfo.agencyType));
            }).map((tabObj: any) => {
                tabObj = Object.assign({}, tabObj);
                tabObj.level = level + 1;
                if (LevelEnum[level] === 'tabList') {
                    tabObj[LevelEnum[tabObj.level]].forEach((subObj: any) => {
                        subObj.headText = [...ProjectManagerCapitalList.headSearches[tabObj.value][subObj.value].heads];
                        subObj.searches = [...ProjectManagerCapitalList.headSearches[tabObj.value][subObj.value].searches];
                    });
                }
                if (tabObj.hasOwnProperty(LevelEnum[tabObj.level]) && tabObj[LevelEnum[tabObj.level]]) {
                    tabObj[LevelEnum[tabObj.level]] = ProjectManagerCapitalList.filterAuth(tabObj[LevelEnum[tabObj.level]], agencyInfo, LevelEnum[tabObj.level], tabObj.level);
                }
                return tabObj;
            });
        }
    }
}

/***
 * 层级
 */
export enum LevelEnum {
    'tabList' = 0,
    'subTabList' = 1,
    'edit' = 2,
    'children' = 3
}

/***
 *  子标签页，根据特定需求修改
 */
export enum SubTabEnum {
    /** 进行中 */
    DOING = '1',
    /** 待还款 */
    TODO = '10',
    /** 已完成 */
    DONE = '3',
    FOUR = '4',
    FIVE = '5',
}

// 尽调状态
export enum SurveyStatusEnum {
    '尽调初审' = 1,
    '尽调终审' = 2,
    '补充资料' = 3,
    '尽调通过' = 4,
    '取消尽调' = 5,
}
// 尽调意见
export enum SurveyInfoEnum {
    '初审尽调意见' = 1,
    '终审尽调意见' = 2,
}

/***
 * 在数组特定位置插入元素
 * @param array 原数组
 * @param positionKeyWord 参考关键字
 * @param ele 插入元素
 * @param position 相对于参考元素位置 after | before
 */
function arraySplice(array: ListHeadsFieldOutputModel[], ele: ListHeadsFieldOutputModel,
                     positionKeyWord: string, position: string) {
    const findIndex = array.findIndex(find => find.value === positionKeyWord);
    const idx = position === 'before' ? findIndex : findIndex + 1;
    array.splice(idx, 0, ele);
    return array;
}
