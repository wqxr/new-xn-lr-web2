import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';

// 列表配置
export default class CommonTableConfig {
  // 列表表头配置-命名是checkerId
  // 上海银行-关联企业参考列表
  static businessRef = {
    heads: [
      { label: '关联企业名称', value: 'name', type: 'text', width: '40%' },
      { label: '关联主体', value: 'kw', type: 'text', width: '25%' },
      { label: '关联级别', value: 'grade', type: 'text', width: '14%' }
    ] as ListHeadsFieldOutputModel[]
  };
  // 上海银行-基础准入资料列表
  static baseFile = {
    heads: [
      { label: '内容', value: 'fileInfo', type: 'file', width: '74%' }
    ] as ListHeadsFieldOutputModel[]
  };
  // 上海银行-台账批量补充信息
  static batchInfoShanghai = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '20%' },
      { label: '收款单位', value: 'debtUnit', width: '15%' },
      { label: '申请付款单位', value: 'projectCompany', width: '15%' },
      { label: '交易金额', value: 'receive', type: 'money', width: '15%' },
      { label: '总部公司', value: 'headquarters', width: '15%' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '14%' }
    ] as ListHeadsFieldOutputModel[]
  };
  // 上海银行-万科接口数据补充信息
  static batchInfoPre = {
    heads: [
      { label: '付款确认书编号', value: 'transNumber', type: 'text', width: '17%' },
      { label: '收款单位', value: 'supplierName', width: '15%'},
      { label: '申请付款单位', value: 'applyCompanyName', width: '15%' },
      { label: '应收账款金额', value: 'financingAmount', type: 'money', width: '16%' },
      { label: '渠道', value: 'financingType', type: 'financingType', width: '12%' },
      { label: '融资利率', value: 'discountRate',  type: 'addPercent', width: '10%'},
      { label: '服务费率', value: 'serviceRate',  type: 'addPercent', width: '9%'},
    ] as ListHeadsFieldOutputModel[]
  };

  static readonly config = {
    businessRef: {
      label: '关联企业参考',
      value: 'businessRef',
      list: {
        label: '',
        value: '',
        canChecked: false,
        edit: {
          leftheadButtons: [],
          rightheadButtons: [],
          rowButtons: []
        },
        headText: [...CommonTableConfig.businessRef.heads],
      } as SubTabListOutputModel,
      post_url: '/shanghai_bank/sh_company_eciinfo/getEquityThrough'
    } as TabListOutputModel,
    baseFile: {
      label: '基础资料',
      value: 'baseFile',
      list: {
        label: '',
        value: 'baseFile',
        canChecked: false,
        edit: {
          leftheadButtons: [
            { label: '无更新/有更新', operate: 'isUpdate', post_url: '', disabled: false, showButton: true },
            { label: '更新时间', operate: 'updateTime', post_url: '', disabled: false, showButton: true },
          ],
          rightheadButtons: [
            { label: '全部下载', operate: 'download_all', post_url: '/', disabled: false, showButton: true, },
          ],
          rowButtons: [
            { label: '查看', operate: 'view', post_url: '', showButton: true },
            { label: '下载', operate: 'download', post_url: '', showButton: true },
          ]
        },
        headText: [...CommonTableConfig.baseFile.heads],
      } as SubTabListOutputModel,
      post_url: ''
    } as TabListOutputModel,
    // 上海银行-台账补充信息
    batchInfoShanghai: {
      label: '已选交易',
      value: 'batchInfoShanghai',
      list: {
        label: '',
        value: 'batchInfoShanghai',
        canChecked: false,
        edit: {
          leftheadButtons: [],
          rightheadButtons: [],
          rowButtons: []
        },
        headText: [...CommonTableConfig.batchInfoShanghai.heads],
      } as SubTabListOutputModel,
      post_url: ''
    } as TabListOutputModel,
    // 上海银行-接口数据列表补充信息
    batchInfoPre: {
      label: '已选交易',
      value: 'batchInfoPre',
      list: {
        label: '',
        value: 'batchInfoPre',
        canChecked: false,
        edit: {
          leftheadButtons: [],
          rightheadButtons: [],
          rowButtons: []
        },
        headText: [...CommonTableConfig.batchInfoPre.heads],
      } as SubTabListOutputModel,
      post_url: ''
    } as TabListOutputModel,
  };

  /**
   * 获取列表配置
   * @param checkerId checker项ID
   */
  static getConfig(checkerId: string) {
    return this.config[checkerId];
  }
}
