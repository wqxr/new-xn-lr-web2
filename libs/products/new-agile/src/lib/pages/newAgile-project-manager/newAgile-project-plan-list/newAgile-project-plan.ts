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



export default class ProjectManagerplanList {
    // 交易列表 -采购融资，默认配置
    static ABSplanbusiness = {
        heads: <ListHeadsFieldOutputModel[]>[
            { label: '资产池编号', value: 'capitalPoolId', },
            { label: '资产池名称', value: 'capitalPoolName', type: 'mainFlowId' },
            { label: '专项计划名称', value: 'projectName', type: 'projectName' },
            { label: '发行规模', value: 'tierReceiveSum', type: 'money' },
            { label: '资产规模', value: 'sumReceive', type: 'money' },
            { label: '产品设立日', value: 'productCreateTime', type: 'date' },
            { label: '专项计划预期到期日', value: 'productendTime', type: 'date' },
            { label: '交易个数', value: 'tradeNumber' },
        ],
        searches: <CheckersOutputModel[]>[
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 2 },
        ],

    };

    // 不同中介机构上传文件按钮权限配置
    static uploadFileConfig = <CheckersOutputModel[]>[
        {
            title: '计划管理人文件', checkerId: 'palnManagerFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false },
        },
        {
            title: '律所文件', checkerId: 'lawFirmFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '资产服务机构文件', checkerId: 'assetServiceOrgFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '评级机构文件', checkerId: 'rateOrgFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '托管服务机构文件', checkerId: 'hostServiceOrgFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '承销机构文件', checkerId: 'saleFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '会计师事务所文件', checkerId: 'accountingFirmFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '资金服务机构文件', checkerId: 'caseServiceOrgFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
        {
            title: '原始权益人文件', checkerId: 'originalOrderFile', type: 'dragonMfile', required: false, value: '',
            leftButtons: [{ label: '下载所有', operate: 'downloadAll', readonly: true }, { label: '下载当前文件', operate: 'downloadNow', readonly: true }],
            options: { "fileext": "jpg, jpeg, png, pdf", helpMsg: 'viewMfile', readonly: false }
        },
    ];

    /**
     * 专项计划列表表头和搜索项配置
     */
    static headSearches = {
        A: {
            DOING: ProjectManagerplanList.ABSplanbusiness
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
        tabConfig[LevelEnum[0]] = ProjectManagerplanList.filterAuth(tabConfig[LevelEnum[0]], agencyInfo, LevelEnum[0], 0);
        // console.log("config======", tabConfig);
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
                authInfo[key] = ProjectManagerplanList.filterAuth(authInfo[key], agencyInfo, key, level);
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
                        subObj.headText = [...ProjectManagerplanList.headSearches[tabObj.value][subObj.value].heads];
                        subObj.searches = [...ProjectManagerplanList.headSearches[tabObj.value][subObj.value].searches];
                    });
                }
                if (tabObj.hasOwnProperty(LevelEnum[tabObj['level']]) && tabObj[LevelEnum[tabObj['level']]]) {
                    tabObj[LevelEnum[tabObj['level']]] = ProjectManagerplanList.filterAuth(tabObj[LevelEnum[tabObj['level']]], agencyInfo, LevelEnum[tabObj['level']], tabObj['level']);
                }
                return tabObj;
            })
        }
    }

    /**
     * 获取项目管理文件配置
     * @param localStorageService 
     * @param xn 
     */
    static getOrgUploadFileConfig(localStorageService: any, xn: any) {
        let agencyFilesAuthMap = localStorageService.caCheMap.get('agencyFilesAuth');
        let agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
        let agencySession = { orgType: Number(window.sessionStorage.getItem('orgType')), agencyType: Number(window.sessionStorage.getItem('agencyType')) };
        // console.log("agencyFilesAuth==", agencyFilesAuthMap, agencyInfoMap, agencySession);

        let agencyFilesAuth = !!agencyFilesAuthMap ? JSON.parse(agencyFilesAuthMap) : XnUtils.deepCopy(ProjectManageAuth.agencyFilesConfig, {});
        let agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
        let fileConfig = XnUtils.deepCopy(ProjectManagerplanList.uploadFileConfig, []);
        let returnFileConfig = fileConfig.filter((obj: any) => agencyFilesAuth[obj.checkerId].agencyTypeList.includes(Number(agencyInfo.agencyType)));
        returnFileConfig.forEach((item: any) => {
            let fileAuth = agencyFilesAuth[item.checkerId];
            if (fileAuth.download.includes(Number(agencyInfo.agencyType)) && !fileAuth.delete.includes(Number(agencyInfo.agencyType))
                && !fileAuth.upload.includes(Number(agencyInfo.agencyType))) {
                //只有下载权限-添加readonly为true
                item.options.readonly = true;
            }
            // 查看文件 下载按钮权限
            if (fileAuth.download.includes(Number(agencyInfo.agencyType))) { item.leftButtons.forEach(t => { t.readonly = false }) }
        });
        // console.log("filesAuth===", returnFileConfig);
        return returnFileConfig;
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
 *  子标签页，针对采购融资交易列表，根据特定需求修改
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

export enum ApiProxyEnum {
    /** 采购融资 */
    A = 'avenger',
    /** 地产abs */
    B = 'avenger',
    C = 'avenger',
    D = 'avenger',
    E = 'avenger',
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
