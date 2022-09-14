
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ProjectManagerList
 * @summary：雅居乐-星顺-项目管理-项目列表页面权限配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying       雅居乐-星顺数据对接     2020-12-03
 * **********************************************************************
 */

import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ProjectManageAuth } from 'libs/shared/src/lib/config/angency-auth';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';



export default class ProjectManagerList {
    // 交易列表 -采购融资，默认配置
    static ABSbusiness = {
        heads: <ListHeadsFieldOutputModel[]>[
            { label: '项目编号', value: 'projectNum', },
            { label: '项目名称', value: 'projectName', type: 'mainFlowId' },
            { label: '总部公司', value: 'headquarters' },
            { label: '项目类型', value: 'projectType', type: 'text' },
            { label: '已发行量', value: 'tierReceiveSum', },
            { label: '总发行量', value: 'publishSum', },
            { label: '获批时间', value: 'passTime', type: 'date' },
            { label: '交易场所', value: 'dealSite', },
        ],
        searches: <CheckersOutputModel[]>[
            { title: '储架名称', checkerId: 'projectName', type: 'text', required: false, sortOrder: 2 },
            { title: '项目类型', checkerId: 'projectType', type: 'select', options: { ref: 'projectTypeset' }, required: false, sortOrder: 5 },
        ],
    };

    /**
     * 根据name获取配置
     * @param name 
     */
    static getConfig(name: string) {
        return ProjectManagerList[name];
    }

    /**
     * 项目列表表头和搜索项配置
     */
    static headSearches = {
        A: {
            DOING: ProjectManagerList.ABSbusiness
        },
        F: {
            DOING: ProjectManagerList.ABSbusiness
        },
    }

    /***
     *  获取页面配置项
     *  @param localStorageService 存储服务
     *  @param xn 通用服务
     *  @param listName 列表名称
     */
    static getTabConfig(localStorageService: any, xn: any, listName: string): any {
        let projectManageAuthMap = localStorageService.caCheMap.get('projectManageAuth');
        let agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
        let agencySession = { orgType: Number(window.sessionStorage.getItem('orgType')), agencyType: Number(window.sessionStorage.getItem('agencyType')) };
        // console.log("projectManageAuth==", projectManageAuthMap, agencyInfoMap, agencySession);
        let tabConfig: TabConfigModel = new TabConfigModel();
        let projectManageAuth = !!projectManageAuthMap ? JSON.parse(projectManageAuthMap) : XnUtils.deepCopy(ProjectManageAuth.allAgencyConfig, {});
        let agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
        tabConfig = projectManageAuth[listName];
        tabConfig['level'] = 0;
        tabConfig[LevelEnum[0]] = ProjectManagerList.filterAuth(tabConfig[LevelEnum[0]], agencyInfo, LevelEnum[0], 0);
        // console.log("config===", tabConfig);
        return tabConfig;
    }

    /**
     * 递归过滤配置对象
     * @param authInfo
     * @param agencyInfo 
     */
    static filterAuth(authInfo: any, agencyInfo: { orgType: number | string, agencyType: number | string }, nodeName: string, level: number) {
        if (Object.prototype.toString.call(authInfo) === "[object Object]") {
            for (let key of Object.keys(authInfo)) {
                authInfo[key] = ProjectManagerList.filterAuth(authInfo[key], agencyInfo, key, level);
            }
            return authInfo;
        } else if (Object.prototype.toString.call(authInfo) === "[object Array]") {
            return authInfo.filter((tabObj: any) => {
                return tabObj.agencyTypeList.includes(Number(agencyInfo.agencyType));
            }).map((tabObj: any) => {
                tabObj = Object.assign({}, tabObj);
                tabObj['level'] = level + 1;
                if (LevelEnum[level] === 'tabList') {
                    tabObj[LevelEnum[tabObj['level']]].forEach((subObj: any) => {
                        subObj.headText = [...ProjectManagerList.headSearches[tabObj.value][subObj.value].heads];
                        subObj.searches = [...ProjectManagerList.headSearches[tabObj.value][subObj.value].searches];
                    });
                }
                if (tabObj.hasOwnProperty(LevelEnum[tabObj['level']]) && tabObj[LevelEnum[tabObj['level']]]) {
                    tabObj[LevelEnum[tabObj['level']]] = ProjectManagerList.filterAuth(tabObj[LevelEnum[tabObj['level']]], agencyInfo, LevelEnum[tabObj['level']], tabObj['level']);
                }
                return tabObj;
            })
        }
    }

}

/***
 *  中介机构类型
 * 层级
 */
export enum AgencyType {
    FATORING        = 0,    /** 保理商 */
    PALNMANAGER     = 1,    /** 计划管理人 */
    ACCOUNTINGFIRM  = 2,    /** 会计师事务所 */
    UNIONSALEORG    = 3,    /** 联合销售机构 */
    RATEORG         = 4,    /** 评级机构 */
    LAWFIRM         = 5,    /** 律师事务所 */
    MAINSALEORG     = 6,    /** 主要销售机构 */
    ASSETSERVICEORG = 7,    /** 资产服务机构 */
    INVESTOR        = 8,    /** 投资者 */
    HOSTSERVICEORG  = 9,    /** 托管服务机构 */
    CASESERVICEORG  = 10,   /** 资金服务机构 */
    REFACTORBANK    = 11,   /** 再保理银行 */
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
