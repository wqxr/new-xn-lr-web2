/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-manage\project-manager\capital-data-analyse\capital-data-analyse.ts
 * @summary：capital-data-analyse.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-15
 ***************************************************************************/

import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';

export default class CapitalDataAnalyseConfig {
  // 数据分析页面
  static capitalPoolOverview = {
    checkers: [
      {title: '资产池名称', checkerId: 'capitalPoolName', type: 'special-text', required: false, value: '', placeholder: ''},
      {
        title: '加权平均剩余期限（天）',
        checkerId: 'paymentDaysAverage',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {
        title: '应收账款余额总计（元）',
        checkerId: 'receiveSum',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {title: '应收账款笔数（笔）', checkerId: 'count', type: 'special-text', required: false, value: '', placeholder: ''},
      {
        title: '项目公司户数（户）',
        checkerId: 'projectCount',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {
        title: '供应商数量（个）',
        checkerId: 'debtUnitCount',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {
        title: '单笔应收账款最小余额（元）',
        checkerId: 'receiveMin',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
      {
        title: '单笔应收账款最大余额（元）',
        checkerId: 'receiveMax',
        type: 'special-text',
        required: false,
        value: '',
        placeholder: ''
      },
    ] as CheckersOutputModel[]
  };

  // 应收账款种类分布
  static contractTypeList = {
    heads: [
      {
        label: '应收账款种类',
        value: 'contractType',
        type: 'contractType',
        _inList: {sort: false, search: true},
        show: true,
        width: '25%'
      },
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 单笔金额分布
  static receiveList = {
    heads: [
      {
        label: '金额',
        value: 'receiveType',
        type: 'receiveType',
        _inList: {sort: false, search: true},
        show: true,
        width: '25%'
      },
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '笔数占比（%）',
        value: 'countRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '50%'
      }
    ] as ListHeadsFieldOutputModel[],
  };

  // 项目公司区域分布
  static projectAreaList = {
    heads: [
      {label: '地区', value: 'province', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 供应商区域分布
  static debtUnitAreaList = {
    heads: [
      {label: '地区', value: 'province', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {false: true, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 项目公司行业分布
  static projectBusinessList = {
    heads: [
      {label: '行业', value: 'projectBusiness', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 剩余账期分布
  static paymentDaysList = {
    heads: [
      {
        label: '剩余账期',
        value: 'paymentDays',
        type: 'paymentDays',
        _inList: {sort: false, search: true},
        show: true,
        width: '25%'
      },
      {label: '笔数（笔）', value: 'number', _inList: {sort: true, search: true}, show: false, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 供应商集中度分布
  static debtUnitList = {
    heads: [
      {label: '供应商', value: 'debtUnit', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  // 项目公司集中度分布
  static projectList = {
    heads: [
      {label: '项目公司', value: 'projectCompany', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '笔数（笔）', value: 'number', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {label: '余额（元）', value: 'receive', type: 'money', _inList: {sort: false, search: true}, show: true, width: '25%'},
      {
        label: '余额占比（%）',
        value: 'surplusRate',
        type: 'rate',
        _inList: {sort: true, search: true},
        show: true,
        width: '25%'
      },
    ] as ListHeadsFieldOutputModel[],
  };

  static tableListAll = [
    {
      title: '应收账款种类分布',
      checkerId: 'contractTypeList',
      tableConfig: CapitalDataAnalyseConfig.contractTypeList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '应收账款种类', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '余额占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-2',
      hasPagination: true
    },
    {
      title: '单笔金额分布',
      checkerId: 'receiveList',
      tableConfig: CapitalDataAnalyseConfig.receiveList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '金额', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '笔数占比合计', key: 'countRate', value: 0, width: '50%'},
      ] as any[],
      id: 'nav-3',
      hasPagination: true
    },
    {
      title: '项目公司区域分布',
      checkerId: 'projectAreaList',
      tableConfig: CapitalDataAnalyseConfig.projectAreaList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '地区', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-4',
      hasPagination: true
    },
    {
      title: '供应商区域分布',
      checkerId: 'debtUnitAreaList',
      tableConfig: CapitalDataAnalyseConfig.debtUnitAreaList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '地区', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-5',
      hasPagination: true
    },
    {
      title: '项目公司行业分布',
      checkerId: 'projectBusinessList',
      tableConfig: CapitalDataAnalyseConfig.projectBusinessList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '行业', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-6',
      hasPagination: true
    },
    {
      title: '剩余账期分布',
      checkerId: 'paymentDaysList',
      tableConfig: CapitalDataAnalyseConfig.paymentDaysList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '剩余账期', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-7',
      hasPagination: true
    },
    {
      title: '供应商集中度分布',
      checkerId: 'debtUnitList',
      tableConfig: CapitalDataAnalyseConfig.debtUnitList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '供应商', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-8',
      hasPagination: true
    },
    {
      title: '项目公司集中度分布',
      checkerId: 'projectList',
      tableConfig: CapitalDataAnalyseConfig.projectList,
      url: '/sample/pool_report',
      urlType: 'dragon',
      data: [],
      // 统计行配置
      census: [
        {label: '项目公司', key: 'sum', value: '', width: '25%'},
        {label: '笔数合计', key: 'number', value: 0, width: '25%'},
        {label: '余额合计', key: 'receive', value: 0, type: 'money', width: '25%'},
        {label: '笔数占比合计', key: 'surplusRate', value: 0, width: '25%'},
      ] as any[],
      id: 'nav-9',
      hasPagination: true
    },
  ];

  /** 右侧导航配置 */
  static barConfig = [
    {id: 'nav-1', value: '1 基础资产池概况', divCss: '', aCss: ''},
    {id: 'nav-2', value: '2 应收账款种类分布', divCss: '', aCss: ''},
    {id: 'nav-3', value: '3 单笔金额分布', divCss: '', aCss: ''},
    {id: 'nav-4', value: '4 项目公司区域分布', divCss: '', aCss: ''},
    {id: 'nav-5', value: '5 供应商区域分布', divCss: '', aCss: ''},
    {id: 'nav-6', value: '6 项目公司行业分布', divCss: '', aCss: ''},
    {id: 'nav-7', value: '7 剩余账期分布', divCss: '', aCss: ''},
    {id: 'nav-8', value: '8 供应商集中度分布', divCss: '', aCss: ''},
    {id: 'nav-9', value: '9 项目公司集中度分布', divCss: '', aCss: ''},
  ];

  /**
   * 给checkes赋值
   */
  static setRowsValue(params: { [key: string]: any }): any {
    CapitalDataAnalyseConfig.capitalPoolOverview.checkers.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        obj.value = params[obj.checkerId];
      }
    });
    return CapitalDataAnalyseConfig.capitalPoolOverview;
  }

  /**
   * 给tableList赋值
   */
  static setTableValue(params: { [key: string]: any }, rateCount: { receiveSum: number, count: number }): any {
    CapitalDataAnalyseConfig.tableListAll.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        let key1 = '';
        let key2 = '';
        let key3 = '';
        if (obj.checkerId !== 'receiveList') {
          key1 = 'surplusRate';
          key2 = 'receive';
          key3 = 'receiveSum';
        } else if (obj.checkerId === 'receiveList') {
          key1 = 'countRate';
          key2 = 'number';
          key3 = 'count';
        }
        params[obj.checkerId].forEach((list: any) => {
          if ((!!list[key2] || String(list[key2]) === '0') && (!!rateCount[key3])) {
            list[key1] = ((Number(list[key2]) / Number(rateCount[key3])) * 100).toFixed(2);
          } else {
            list[key1] = 0;
          }
        });
        if (obj.checkerId !== 'receiveList') {
          params[obj.checkerId].sort((a, b) => a.surplusRate - b.surplusRate);
        }
        obj.data = params[obj.checkerId];
        // 统计数据
        obj.census.forEach((cen: any) => {
          if (cen.key === 'sum') {
            cen.value = '合计';
          } else {
            const val = params[obj.checkerId].reduce((accumulator: number, currentValue: string | number) => {
              return accumulator + Number(currentValue[cen.key] ? currentValue[cen.key] : 0);
            }, 0);
            cen.value = !['number', 'sum'].includes(cen.key) ? val.toFixed(2) : val;
          }
        });
      }
    });
    return CapitalDataAnalyseConfig.tableListAll;
  }

  static getConfig(name: string, type: string) {
    return CapitalDataAnalyseConfig[name][type];
  }
}
