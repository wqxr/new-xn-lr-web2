/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\project-plan-list\dragon-project-plan.ts
 * @summary：dragon-project-plan.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { CheckersOutputModel } from '../../../../../../../../shared/src/lib/config/checkers';
import {
  ListHeadsFieldOutputModel,
  TabConfigModel
} from '../../../../../../../../shared/src/lib/config/list-config-model';
import { ProjectManageAuth } from '../../../../../../../../shared/src/lib/config/angency-auth';
import { XnUtils } from '../../../../../../../../shared/src/lib/common/xn-utils';
import { SubTabValue, TabValue } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export default class ProjectManagerPlanList {
  // 交易列表 -采购融资，默认配置
  static ABSplanbusiness = {
    heads: [
      {label: '资产池编号', value: 'capitalPoolId'},
      {label: '资产池名称', value: 'capitalPoolName', type: 'mainFlowId'},
      {label: '专项计划名称', value: 'projectName', type: 'projectName'},
      {label: '发行规模', value: 'tierReceiveSum', type: 'money'},
      {label: '资产规模', value: 'sumReceive', type: 'money'},
      {label: '产品设立日', value: 'productCreateTime', type: 'date'},
      {label: '专项计划预期到期日', value: 'productendTime', type: 'date'},
      {label: '交易个数', value: 'tradeNumber'},
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 2},
    ] as CheckersOutputModel[],
  };

  // 不同中介机构上传文件按钮权限配置
  static uploadFileConfig = [
    {
      title: '计划管理人文件', checkerId: 'palnManagerFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false},
    },
    {
      title: '律所文件', checkerId: 'lawFirmFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '资产服务机构文件', checkerId: 'assetServiceOrgFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '评级机构文件', checkerId: 'rateOrgFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '托管服务机构文件', checkerId: 'hostServiceOrgFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '承销机构文件', checkerId: 'saleFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '会计师事务所文件', checkerId: 'accountingFirmFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '资金服务机构文件', checkerId: 'caseServiceOrgFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
    {
      title: '原始权益人文件', checkerId: 'originalOrderFile', type: 'dragonMfile', required: false, value: '',
      leftButtons: [{label: '下载所有', operate: 'downloadAll', readonly: true}, {
        label: '下载当前文件',
        operate: 'downloadNow',
        readonly: true
      }],
      options: {fileext: 'jpg, jpeg, png, pdf', others: {helpMsg: 'viewMfile'}, readonly: false}
    },
  ] as CheckersOutputModel[];

  /**
   * 专项计划列表表头和搜索项配置
   */
  static headSearches = {
    [TabValue.First]: {
      [SubTabValue.DOING]: ProjectManagerPlanList.ABSplanbusiness
    },
  };

  /***
   *  获取页面配置项
   *  @param localStorageService 存储服务
   *  @param xn 通用服务
   *  @param listName 列表名称
   */
  static getTabConfig(localStorageService: any, xn: any, listName: string): any {
    const projectManageAuthMap = localStorageService.caCheMap.get('projectManageAuth');
    const agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
    const agencySession = {
      orgType: Number(window.sessionStorage.getItem('orgType')),
      agencyType: Number(window.sessionStorage.getItem('agencyType'))
    };
    let tabConfig: TabConfigModel;
    const projectManageAuth = !!projectManageAuthMap
      ? JSON.parse(projectManageAuthMap)
      : XnUtils.deepCopy(ProjectManageAuth.allAgencyConfig, {});
    const agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
    tabConfig = projectManageAuth[listName];
    tabConfig.level = 0;
    tabConfig[LevelEnum[0]] = ProjectManagerPlanList.filterAuth(tabConfig[LevelEnum[0]], agencyInfo, LevelEnum[0], 0);
    return tabConfig;
  }

  /**
   * 递归过滤配置对象
   */
  static filterAuth(authInfo: any, agencyInfo: { orgType: number | string, agencyType: number | string }, nodeName: string, level: number) {
    if (Object.prototype.toString.call(authInfo) === '[object Object]') {
      for (const key of Object.keys(authInfo)) {
        authInfo[key] = ProjectManagerPlanList.filterAuth(authInfo[key], agencyInfo, key, level);
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
            subObj.headText = [...ProjectManagerPlanList.headSearches[tabObj.value][subObj.value].heads];
            subObj.searches = [...ProjectManagerPlanList.headSearches[tabObj.value][subObj.value].searches];
          });
        }
        if (tabObj.hasOwnProperty(LevelEnum[tabObj.level]) && tabObj[LevelEnum[tabObj.level]]) {
          tabObj[LevelEnum[tabObj.level]] = ProjectManagerPlanList
            .filterAuth(tabObj[LevelEnum[tabObj.level]], agencyInfo, LevelEnum[tabObj.level], tabObj.level);
        }
        return tabObj;
      });
    }
  }

  /**
   * 获取项目管理文件配置
   * @param localStorageService any
   * @param xn any
   */
  static getOrgUploadFileConfig(localStorageService: any, xn: any) {
    const agencyFilesAuthMap = localStorageService.caCheMap.get('agencyFilesAuth');
    const agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
    const agencySession = {
      orgType: Number(window.sessionStorage.getItem('orgType')),
      agencyType: Number(window.sessionStorage.getItem('agencyType'))
    };

    const agencyFilesAuth = !!agencyFilesAuthMap
      ? JSON.parse(agencyFilesAuthMap)
      : XnUtils.deepCopy(ProjectManageAuth.agencyFilesConfig, {});
    const agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepCopy(agencySession, {});
    const fileConfig = XnUtils.deepCopy(ProjectManagerPlanList.uploadFileConfig, []);
    const returnFileConfig = fileConfig
      .filter((obj: any) => agencyFilesAuth[obj.checkerId].agencyTypeList.includes(Number(agencyInfo.agencyType)));
    returnFileConfig.forEach((item: any) => {
      const fileAuth = agencyFilesAuth[item.checkerId];
      if (fileAuth.download.includes(Number(agencyInfo.agencyType)) && !fileAuth.delete.includes(Number(agencyInfo.agencyType))
        && !fileAuth.upload.includes(Number(agencyInfo.agencyType))) {
        // 只有下载权限-添加readonly为true
        item.options.readonly = true;
      }
      // 查看文件 下载按钮权限
      if (fileAuth.download.includes(Number(agencyInfo.agencyType))) { item.leftButtons.forEach(t => { t.readonly = false; }); }
    });
    return returnFileConfig;
  }
}

/***
 * 层级
 */
export enum LevelEnum {
  'tabList'    = 0,
  'subTabList' = 1,
  'edit'       = 2,
  'children'   = 3
}
