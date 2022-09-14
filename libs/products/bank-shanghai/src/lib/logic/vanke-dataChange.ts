import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：万科数据对接情况配置列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-05-05
 * **********************************************************************
 */

export default class VankeDataChangeList {
  // 接口推送情况
  static interfacePush = {
    heads: [
      { label: '推送时间', value: 'updatetime', type: 'date' },
      { label: '接口名称', value: 'callType', type: 'callType' },
      { label: '推送内容', value: 'callStatus', type: 'callStatus' },
      { label: '描述信息', value: 'msg', type: 'msg' },
      { label: '接口结果', value: 'status', type: 'status' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 数据变动情况
  static dataChangeList = {
    heads: [
      { label: '字段', value: 'field' },
      { label: '业务平台数据', value: 'currentField' },
    ] as ListHeadsFieldOutputModel[],
  };

  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    // 平台
    platmachineAccount: {
      title: '',
      tabList: [
        {
          label: '接口推送情况',
          value: 'A',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              count: 0,
              headText: VankeDataChangeList.interfacePush.heads,
            },
          ],
          post_url: '/sub_system/sh_vanke_system/get_vanke_call_record',
          params: 1,
        },
        {
          label: '数据变动情况',
          value: 'B',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              headText: VankeDataChangeList.dataChangeList.heads,
            },
          ],
          post_url: '/sub_system/sh_vanke_system/get_vanke_history',
          params: 2,
        },
      ],
    } as TabConfigModel,
    // 万科流程--平台审核经办、复核数据变动
    platVerify: {
      title: '',
      tabList: [
        {
          label: '数据变动情况',
          value: 'C',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              headText: VankeDataChangeList.dataChangeList.heads,
            },
          ],
          post_url: '/sub_system/sh_vanke_system/get_vanke_history',
          params: 1,
        },
      ],
    } as TabConfigModel,
  };

  /**
   * 组装数据
   * @param resData 接口返回数据
   * @param heads 动态表头
   */
  static reorganizeData(
    resData: { nowData: object; lastList: any[]; count: number },
    heads: any
  ): any[] {
    const returnList = [];
    allFiledArr.forEach((val, index, arr) => {
      if (resData.lastList) {
        const item = {
          field: VankeDataChangeList.getConfLabel(filedLabelArr, val),
          currentField: '',
          // uuid: VankeDataChangeList.getUuId(resData),
          fieldName: val, // 字段标识
          isChanged: VankeDataChangeList.filedChanged(resData, val, heads), // 是否有变动，标红
          fieldType: VankeDataChangeList.jdugeFieldType(val),
        };
        // 业务平台数据
        if (
          !!resData.lastList[0][val] ||
          String(resData.lastList[0][val]) === '0'
        ) {
          item.currentField = resData.lastList[0][val];
        }
        // 变动数据-以时间为表头
        heads.forEach((t: any, i: number) => {
          if (
            !!resData.lastList.slice(1)[i][val] ||
            String(resData.lastList.slice(1)[i][val]) === '0'
          ) {
            item[t.value] = resData.lastList.slice(1)[i][val];
          }
        });
        returnList.push(item);
      }
    });
    return returnList;
  }

  /**
   * 根据name获取指定配置
   * @param name platmachineAccount、platVerify
   */
  static getConfig(name: string) {
    return this.config[name];
  }

  /**
   * 根据value获取对应label
   * @param filedLabelArr
   * @param value
   */
  static getConfLabel(filedLabelArr: any[], value: string): string {
    if (filedLabelArr.length) {
      for (const obj of filedLabelArr) {
        if (obj.value.toString() === value.toString()) {
          return obj.label;
        }
      }
    }
    return '';
  }

  /**
   * 判断字段是否有变动
   * @param res 接口返回数据
   * @param val 字段名
   * @param heads 表头(动态生成的时间)
   */
  static filedChanged(res: any, val: string, heads: any): string[] {
    const changeArr = [];
    if (res.lastList && res.lastList.length >= 1) {
      res.lastList.forEach((v: any, i: number) => {
        const index = i;
        if (
          index < res.lastList.length - 1 &&
          res.lastList[index][val] !== undefined
        ) {
          // 当前业务数据未返回 则不进行比对
          if (typeof res.lastList[index][val] === 'string') {
            // 字符串去空判断
            res.lastList[index][val].trim();
            res.lastList[index + 1][val].trim();
          }
          if (
            res.lastList[index][val] !== res.lastList[index + 1][val] &&
            JSON.stringify(res.lastList[index][val]) !==
              JSON.stringify(res.lastList[index + 1][val])
          ) {
            // 有变动
            if (index === 0) {
              changeArr.push('currentField', heads[0].value);
            } else {
              changeArr.push(heads[index - 1].value, heads[index].value);
            }
          } else {
            // 无变动
            // if (index === 0) {
            //     changeArr = changeArr.filter((x: any) => x !== heads[0]['value'] && x !== 'currentField');
            // } else {
            //     changeArr = changeArr.filter((x: any) => x !== heads[index - 1]['value'] && x !== heads[index]['value']);
            // }
          }
        }
      });
    }

    return [...changeArr];
  }

  /**
   * 获取uuid，用于发票
   * @param res
   */
  static getUuId(res: any): any {
    const obj = {
      currentField: '',
      lastField: '',
      lastestField: '',
    };
    // obj.currentField = res.nowData['uuid'];
    if (res.lastList && res.lastList.length >= 1) {
      obj.lastField = res.lastList[0].uuid;
    }
    if (res.lastList && res.lastList.length >= 2) {
      obj.lastestField = res.lastList[1].uuid;
    }
    return obj;
  }

  /**
   * 判断字段类型
   */
  static jdugeFieldType(field: string): string {
    let type = 'text';
    if (moneyType.includes(field)) {
      type = 'money';
    } else if (invoiceListType.includes(field)) {
      type = 'invoice';
    } else if (dateType.includes(field)) {
      type = 'date';
    } else if (dateTimeType.includes(field)) {
      type = 'datetime';
    } else if (longdatetimeType.includes(field)) {
      type = 'longdatetime';
    } else if (selectType.includes(field)) {
      type = 'select';
    } else if (rateType.includes(field)) {
      type = 'rate';
    } else {
      type = 'text';
    }
    return type;
  }
}
export const moneyType = ['financingAmount', ''];
export const invoiceListType = ['invoiceList'];
export const dateType = ['expiredDate', 'payDate', ''];
export const dateTimeType = [
  'invalidTimes',
  'ccsCreatetime',
  'ccsUpdatetime',
  'preTime',
  'signTime',
  'signDownTime',
  'refundTime',
  'bankConfirmDate',
  'webUpdateTime',
  'oprtUpdatetime',
];
export const longdatetimeType = [
  'ccsAduitDatetime',
  'ccsApproveTime',
  'ccsZauditDate',
];
export const selectType = [
  'scfStatus',
  'preState',
  'updateType',
  'payState',
  'signStatus',
  'signIsDown',
  'refundState',
  'realyPayState',
  'acceptState',
  'bankConfirmState',
  'isGiveFile',
];
export const rateType = ['discountRate'];

export const rquiredFiledArr = [
  'uuid', // 融资单唯一标志码
  'capitalName', // 应收账款受让方
  'bankName', // 托管行
  'applyCompanyName', // 申请付款单位
  'cityCompany', // 申请付款单位归属城市
  'contractSupplier', // 收款单位 == 合同供应商
  'supplierName', // 收款单位户名
  'payeeBankName', // 收款单位开户行
  'payeeAccountName', // 收款单位账号
  'transNumber', // 付款确认书编号
  'ccsAduitDatetime', // 一线审核时间
  'ccsApproveTime', // 一线审批时间
  'ccsZauditDate', // 资金中心审核时间
  'currencyName', // 币种名称
  'feeTypeName', // 款项类型名称
  'expiredDate', // 保理融资到期日
  'financingAmount', // 应收账款金额
  'contractNumber', // 合同编号
  'outputNumber', // 产值号
  'localCurExRate', // 汇率
  'curProject', // 项目名称
  'scfStatus', // 状态
  'invalidTimes', // 作废时间
  'payAccount', // 付款账号
  'payBank', // 付款银行
  'billNumber', // 一线单据编号
  'paymentBillNumber', // 源单编号
  'ccsCreatetime', // 创建时间
  'ccsUpdatetime', // CCS更新时间
  'oprtUpdatetime', // 资金方操作时间
  'area', // 核心企业内部区域
  'invoiceList', // 发票信息
];
export const optionalFiledArr = [
  'preState', // 预审状态 0:未审核,1:通过,2:未通过
  'preTime', // 预审时间
  'updateType', // 修改类型 1:业务资料修改;2:收款信息修改3:更换资金渠道4:业务终止
  'preNoResult', // 预审修改原因
  'payState', // 可放款状态0：待放款1：确认放款
  'payBatch', // 可放款批次号
  'signStatus', // 签章状态 1未签章 5已签章 9已作废
  'signTime', // 签章时间
  'signUser', // 签章操作人
  'signIsDown', // 签章是否下载 0否 1是
  'signDownUser', // 签章下载人
  'signDownTime', // 签章下载时间
  'signDownCount', // 签章下载次数
  'refundState', // 退票状态 “0”：正常 “1”：退票成功
  'refundUser', // 退票人
  'refundResult', // 退票原因
  'refundTime', // 退票时间
  'remark', // 备注
  'financingType', // 融资类型 如ABS

  'payDate', // 实际放款日  ？？
  'capitalFinDays', // 保理融资天数
  'discountRate', // 融资利率

  'acceptState', // 资金中心受理：0未受理，1已受理
  'realyPayState', // 实际付款状态 0未付款1已付款
  'realyPayBatch', // 实际付款批次号

  'capitalServeName', // 资产服务方名称
  'webUpdateTime', // web 操作更新时间
  'bankConfirmState', // 银行交单状态 0=未放款 1=可放款
  'bankConfirmDate', // 银行交单时间
  'isGiveFile', // 是否已出具付款确认书
];
export const allFiledArr = [...rquiredFiledArr, ...optionalFiledArr];
export const filedLabelArr = [
  // 一直展示，数据有差异则标红
  { label: '融资单唯一标志码', value: 'uuid' }, // 融资单唯一标志码
  { label: '应收账款受让方', value: 'capitalName' }, // 应收账款受让方
  { label: '托管行', value: 'bankName' }, // 托管行
  { label: '申请付款单位', value: 'applyCompanyName' }, // 申请付款单位
  { label: '申请付款单位归属城市', value: 'cityCompany' }, // 申请付款单位归属城市
  { label: '收款单位', value: 'contractSupplier' }, // 收款单位
  { label: '收款单位户名', value: 'supplierName' }, // 收款单位户名
  { label: '收款单位开户行', value: 'payeeBankName' }, // 收款单位开户行
  { label: '收款单位账号', value: 'payeeAccountName' }, // 收款单位账号
  { label: '转让编号', value: 'transNumber' }, // 转让编号
  { label: '一线审核时间', value: 'ccsAduitDatetime' }, // 一线审核时间
  { label: '一线审批时间', value: 'ccsApproveTime' }, // 一线审批时间
  { label: '资金中心审核时间', value: 'ccsZauditDate' }, // 资金中心审核时间
  { label: '币种名称', value: 'currencyName' }, // 币种名称
  { label: '款项类型名称', value: 'feeTypeName' }, // 款项类型名称
  { label: '保理融资到期日', value: 'expiredDate' }, // 保理融资到期日
  { label: '应收账款金额', value: 'financingAmount' }, // 应收账款金额
  { label: '合同编号', value: 'contractNumber' }, // 合同编号
  { label: '产值号', value: 'outputNumber' }, // 产值号
  { label: '付款确认书编号', value: 'transNumber' }, // 付款确认书编号
  { label: '汇率', value: 'localCurExRate' }, // 汇率
  { label: '项目名称', value: 'curProject' }, // 项目名称
  { label: '状态', value: 'scfStatus' }, // 状态
  { label: '作废时间', value: 'invalidTimes' }, // 作废时间
  { label: '付款账号', value: 'payAccount' }, // 付款账号
  { label: '付款银行', value: 'payBank' }, // 付款银行
  { label: '一线单据编号', value: 'billNumber' }, // 一线单据编号
  { label: '源单编号', value: 'paymentBillNumber' }, // 源单编号
  { label: '创建时间', value: 'ccsCreatetime' }, // 创建时间
  { label: 'CCS更新时间', value: 'ccsUpdatetime' }, // CCS更新时间
  { label: '资金方操作时间', value: 'oprtUpdatetime' }, // 资金方操作时间
  { label: '核心企业内部区域', value: 'area' }, // 核心企业内部区域
  { label: '发票信息', value: 'invoiceList' }, // 发票信息

  // 仅当发生变动时展示
  { label: '预审状态', value: 'preState' }, // 预审状态 0:未审核,1:通过,2:未通过
  { label: '预审时间', value: 'preTime' }, // 预审时间
  { label: '修改类型', value: 'updateType' }, // 修改类型 1:业务资料修改;2:收款信息修改3:更换资金渠道4:业务终止
  { label: '预审修改原因', value: 'preNoResult' }, // 预审修改原因
  { label: '可放款状态', value: 'payState' }, // 可放款状态0：待放款1：确认放款
  { label: '可放款批次号', value: 'payBatch' }, // 可放款批次号
  { label: '签章状态', value: 'signStatus' }, // 签章状态 1未签章 5已签章 9已作废
  { label: '签章时间', value: 'signTime' }, // 签章时间
  { label: '签章操作人', value: 'signUser' }, // 签章操作人
  { label: '签章是否下载', value: 'signIsDown' }, // 签章是否下载 0否 1是
  { label: '签章下载人', value: 'signDownUser' }, // 签章下载人
  { label: '签章下载时间', value: 'signDownTime' }, // 签章下载时间
  { label: '签章下载次数', value: 'signDownCount' }, // 签章下载次数
  { label: '退票状态', value: 'refundState' }, // 退票状态
  { label: '退票人', value: 'refundUser' }, // 退票人
  { label: '退票原因', value: 'refundResult' }, // 退票原因
  { label: '退票时间', value: 'refundTime' }, // 退票时间
  { label: '备注', value: 'remark' }, // 备注
  { label: '融资类型', value: 'financingType' }, // 融资类型
  { label: '实际放款日', value: 'payDate' }, // 实际放款日
  { label: '保理融资天数', value: 'capitalFinDays' }, // 保理融资天数
  { label: '融资利率', value: 'discountRate' }, // 融资利率
  { label: '资金中心受理', value: 'acceptState' }, // 资金中心受理：0未受理，1已受理
  { label: '实际付款状态', value: 'realyPayState' }, // 实际付款状态 0未付款1已付款
  { label: '实际付款批次号', value: 'realyPayBatch' }, // 实际付款批次号
  { label: '资产服务方名称', value: 'capitalServeName' }, // 资产服务方名称
  { label: 'web操作更新时间 ', value: 'webUpdateTime' }, // web操作更新时间
  { label: '银行交单状态', value: 'bankConfirmState' }, // 银行交单状态
  { label: '银行交单时间', value: 'bankConfirmDate' }, // 银行交单时间
  { label: '是否已出具付款确认书', value: 'isGiveFile' }, // 是否已出具付款确认书
];
