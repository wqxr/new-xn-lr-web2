/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：工商状态页面checker配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   yu             新增                 2020-01-17
 * **********************************************************************
 */
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';

export default class BusinessStateConfig {
  // 工商状态页面
  // 基本信息
  static basicInfo = {
    checkers: [
      { title: '企业名称', checkerId: 'Name', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '法定代表人', checkerId: 'OperName', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '统一社会信用代码', checkerId: 'CreditCode', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '经营状态', checkerId: 'Status', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '注册资本', checkerId: 'RegistCapi', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '企业类型', checkerId: 'EntType', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '登记机关', checkerId: 'BelongOrg', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '营业期限', checkerId: 'TermStart', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '所属地区', checkerId: 'Area', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '注册地址', checkerId: 'Address', type: 'special-text', required: false, value: '', placeholder: '' },
      { title: '经营范围', checkerId: 'Scope', type: 'textarea', required: false, options: {readonly: true}, value: '', placeholder: '' },
    ] as CheckersOutputModel[]
  };

  // 股东信息
  static shareholderInfo = {
    heads: [
      { label: '股东', value: 'StockName', type: 'text', _inList: { sort: true, search: true }, show: true, width: '45%' },
      { label: '持股比例（%）', value: 'StockPercent', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '认缴出资额（万元）', value: 'ShouldCapi', type: 'money', _inList: { sort: true, search: true }, show: true, width: '35%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 被执行人信息
  static executedPersonInfo = {
    heads: [
      { label: '案号', value: 'Anno', type: 'text', _inList: { sort: true, search: true }, show: true, width: '20%' },
      { label: '执行法院', value: 'ExecuteGov', type: 'text', _inList: { sort: true, search: true }, show: true, width: '35%' },
      { label: '执行标的（元）', value: 'Biaodi', type: 'money', _inList: { sort: true, search: true }, show: true, width: '25%' },
      { label: '立案时间', value: 'Liandate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 裁判文书信息
  static refereeInfo = {
    heads: [
      { label: '裁判文书编号', value: 'CaseNo', _inList: { sort: true, search: true }, show: true, width: '20%' },
      { label: '裁判文书名字', value: 'CaseName', _inList: { sort: true, search: true }, show: true, width: '20%' },
      { label: '执行法院', value: 'Court', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '案由', value: 'CaseReason', type: 'text', _inList: { sort: true, search: true }, show: true, width: '30%' },
      { label: '案由审判时间', value: 'UpdateDate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '10%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 法院公告信息
  static courtAnnounceInfo = {
    heads: [
      { label: '公告法院', value: 'Court', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '类型', value: 'Category', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '内容', value: 'Content', type: 'text', _inList: { sort: true, search: true }, show: true, width: '35%' },
      { label: '当事人', value: 'Party', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '刊登日期', value: 'PublishedDate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 开庭公告信息
  static holdCourtInfo = {
    heads: [
      { label: '案号', value: 'CaseNo', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '案由', value: 'CaseReason', _inList: { sort: true, search: true }, show: true, width: '35%' },
      { label: '被告', value: 'Defendantlist', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '原告', value: 'Prosecutorlist', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '开庭日期', value: 'LianDate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 立案信息
  static filingInfo = {
    heads: [
      { label: '案号', value: 'CaseNo', type: 'text', _inList: { sort: true, search: true }, show: true, width: '20%' },
      { label: '案件年份', value: 'PublishDate', _inList: { sort: true, search: true }, show: true, width: '25%' },
      { label: '公诉人/原告/上诉人/申请人', value: 'ProsecutorList', type: 'text', _inList: { sort: true, search: true }, show: true, width: '25%' },
      { label: '被告人/被告/被上诉人', value: 'DefendantList', type: 'text', _inList: { sort: true, search: true }, show: true, width: '25%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 经营异常信息
  static abnormalBusinessInfo = {
    heads: [
      { label: '列入日期', value: 'AddDate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '列入经营异常名录原因', value: 'AddReason', _inList: { sort: true, search: true }, show: true, width: '32%' },
      { label: '移出日期', value: 'RemoveDate', type: 'text', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '移出经营异常名录原因', value: 'RomoveReason', type: 'text', _inList: { sort: true, search: true }, show: true, width: '33%' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 变更记录
  static changeLogs = {
    heads: [
      { label: '变更日期', value: 'ChangeDate', type: 'longdatetime', _inList: { sort: true, search: true }, show: true, width: '15%' },
      { label: '变更项目', value: 'ProjectName', _inList: { sort: true, search: true }, show: true, width: '25%' },
      // { label: '变更前', value: 'BeforeList', type: 'stringList', _inList: { sort: true, search: true }, show: true, width: '27%' },
      // { label: '变更后', value: 'AfterList', type: 'stringList', _inList: { sort: true, search: true }, show: true, width: '28%' },
      { label: '变更前', value: 'BeforeInfoList', type: 'objList', _inList: { sort: true, search: true }, show: true, width: '27%' },
      { label: '变更后', value: 'AfterInfoList', type: 'objList', _inList: { sort: true, search: true }, show: true, width: '28%' },
    ] as ListHeadsFieldOutputModel[],
  };

  static tableListAll = [{
    title: '股东信息',
    checkerId: 'shareholderInfo',
    tableConfig: BusinessStateConfig.shareholderInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-2',
    hasPagination: true
  },
  {
    title: '被执行人信息',
    checkerId: 'executedPersonInfo',
    tableConfig: BusinessStateConfig.executedPersonInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-3',
    hasPagination: true
  },
  {
    title: '裁判文书信息',
    checkerId: 'refereeInfo',
    tableConfig: BusinessStateConfig.refereeInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-4',
    hasPagination: true
  },
  {
    title: '法院公告信息',
    checkerId: 'courtAnnounceInfo',
    tableConfig: BusinessStateConfig.courtAnnounceInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-5',
    hasPagination: true
  },
  {
    title: '开庭公告信息',
    checkerId: 'holdCourtInfo',
    tableConfig: BusinessStateConfig.holdCourtInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-6',
    hasPagination: true
  },
  {
    title: '立案信息',
    checkerId: 'filingInfo',
    tableConfig: BusinessStateConfig.filingInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-7',
    hasPagination: true
  },
  {
    title: '经营异常信息',
    checkerId: 'abnormalBusinessInfo',
    tableConfig: BusinessStateConfig.abnormalBusinessInfo,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-8',
    hasPagination: true
  },
  {
    title: '变更记录',
    checkerId: 'changeLogs',
    tableConfig: BusinessStateConfig.changeLogs,
    url: '',
    urlType: 'dragon',
    data: [],
    // 统计行配置
    census: [] as any[],
    id: 'nav-9',
    hasPagination: true
  },
  ];

  /**
   * 右侧导航配置
   */
  static barConfig = [
    { id: 'nav-1', value: '1 基本信息', divCss: '', aCss: '' },
    { id: 'nav-2', value: '2 股东信息', divCss: '', aCss: '' },
    { id: 'nav-3', value: '3 被执行人信息', divCss: '', aCss: '' },
    { id: 'nav-4', value: '4 裁判文书信息', divCss: '', aCss: '' },
    { id: 'nav-5', value: '5 法院公告信息', divCss: '', aCss: '' },
    { id: 'nav-6', value: '6 开庭公告信息', divCss: '', aCss: '' },
    { id: 'nav-7', value: '7 立案信息', divCss: '', aCss: '' },
    { id: 'nav-8', value: '8 经营异常信息', divCss: '', aCss: '' },
    { id: 'nav-9', value: '9 变更记录', divCss: '', aCss: '' },
  ];

  /**
   * 给checkes赋值
   */
  static setRowsValue(params: { [key: string]: any }): any {
    BusinessStateConfig.basicInfo.checkers.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        switch (obj.checkerId) {
          case 'EntType':
            obj.value = SelectOptions.getConfLabel(obj.checkerId, params[obj.checkerId]);
            break;
          case 'TermStart':
            obj.value = `${params[obj.checkerId]} - ${params.TeamEnd || '无固定期限'}`;
            break;
          case 'Area':
            obj.value = `${params[obj.checkerId].Province}${params[obj.checkerId].City}${params[obj.checkerId].County}`;
            break;
          default:
            obj.value = params[obj.checkerId];
            break;
        }
      }
    });
    return BusinessStateConfig.basicInfo;
  }

  /**
   * 给tableList赋值-统计数据
   * @param params
   */
  static setTableValue(params: { [key: string]: any }): any {
    BusinessStateConfig.tableListAll.forEach((obj) => {
      if (params.hasOwnProperty(obj.checkerId)) {
        switch (obj.checkerId) {
          case 'filingInfo':
            params[obj.checkerId].map((x: any) => {
              x.ProsecutorList = x.ProsecutorList.map((y: any) => y.Name).join('，\t');
              x.DefendantList = x.DefendantList.map((y: any) => y.Name).join('，\t');
            });
            obj.data = params[obj.checkerId];
            break;
          case 'changeLogs':
            params[obj.checkerId].map((x: any) => {
              x.BeforeInfoList = x.BeforeInfoList.map((y: any) => y.Content || '').join('，');
              x.AfterInfoList = x.AfterInfoList.map((y: any) => y.Content || '').join('，');
            });
            obj.data = params[obj.checkerId];
            break;
          default:
            obj.data = params[obj.checkerId];
            break;
        }
      }
    });
    return BusinessStateConfig.tableListAll;
  }

  static getConfig(name: string, type: string) {
    return BusinessStateConfig[name][type];
  }
}
