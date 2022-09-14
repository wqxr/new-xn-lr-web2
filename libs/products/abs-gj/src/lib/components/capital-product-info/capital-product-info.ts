/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\capital-product-info\capital-product-info.ts
 * @summary：capital-product-info.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { CheckersOutputModel } from '../../../../../../shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel } from '../../../../../../shared/src/lib/config/list-config-model';

declare const moment: any;

export default class CapitalcapitalProductInfoConfig {
  // 基础资产池概况
  static capitalPoolOverview = {
    checkers: [
      {title: '资产池名称', checkerId: 'capitalPoolName', type: 'special-text', required: false, value: '', placeholder: ''},
      {title: '发行方式', checkerId: 'publishMode', type: 'special-text', required: false, value: '', placeholder: ''},
      {title: '发行规模', checkerId: 'poolSum', type: 'special-text', required: false, value: '', placeholder: ''},
      {title: '配售日', checkerId: 'rationTime', type: 'special-text', required: false, value: '', placeholder: ''},
      {title: '设立日', checkerId: 'productCreateTime', type: 'special-text', required: false, value: '', placeholder: ''},
      {title: '专项计划信用等级', checkerId: 'gradeStr', type: 'special-text', required: false, value: '', placeholder: ''},
      {
        title: '托管银行',
        checkerId: 'factoringBankName',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {title: '交易市场', checkerId: 'dealSite', type: 'special-text', required: false, value: '', placeholder: ''},
    ] as CheckersOutputModel[]
  };

  // 层级信息
  static levelInfoList = {
    heads: [
      {label: '层级名称', value: 'investTierName', show: true, width: '35%'},
      {label: '产品期限', value: 'productTerm', show: true, width: '25%'},
      {label: '产品到期日', value: 'productendTime', type: 'date', show: true, width: '25%'},
    ] as ListHeadsFieldOutputModel[],
    searches: []
  };

  // 专项计划相关文件
  static specialProjectFileList = {
    heads: [
      {label: '文件', value: 'files', type: 'file', show: true, width: '40%'},
      {label: '文件来源', value: 'fileType', type: 'fileSource', show: true, width: '25%'},
    ] as ListHeadsFieldOutputModel[],
    searches: []
  };

  static tableListAll = [{
    title: '层级信息',
    checkerId: 'levelInfoList',
    tableConfig: CapitalcapitalProductInfoConfig.levelInfoList,
    url: '/project_manage/agency/agency_info_list',
    urlType: 'dragon',
    data: [],
    id: 'levelInfoList',
    hasPagination: false,
    hasNo: false,
    rowBtn: []
  }, {
    title: '专项计划相关文件',
    checkerId: 'specialProjectFileList',
    tableConfig: CapitalcapitalProductInfoConfig.specialProjectFileList,
    url: '/project_manage/file_agency/get_agency_file_list',
    urlType: 'dragon',
    data: [],
    id: 'specialProjectFileList',
    hasPagination: true,
    hasNo: true,
    rowBtn: [{label: '下载', operate: 'project_file_download'}]
  }];

  /**
   * 给checkes赋值
   */
  static setRowsValue(params: { [key: string]: any }): any {
    CapitalcapitalProductInfoConfig.capitalPoolOverview.checkers.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        if (['rationTime', 'productCreateTime'].includes(obj.checkerId)) {
          obj.value = params[obj.checkerId] > 0 ? moment(params[obj.checkerId]).format('YYYY-MM-DD') : '';
        } else {
          obj.value = params[obj.checkerId];
        }

      }
    });
    return CapitalcapitalProductInfoConfig.capitalPoolOverview;
  }

  /**
   * 给tableList赋值
   */
  static setTableValue(params: { [key: string]: any }): any {
    CapitalcapitalProductInfoConfig.tableListAll.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        obj.data = params[obj.checkerId];
      }
    });
    return CapitalcapitalProductInfoConfig.tableListAll;
  }

  static getConfig(name: string, type: string) {
    return CapitalcapitalProductInfoConfig[name][type];
  }
}
