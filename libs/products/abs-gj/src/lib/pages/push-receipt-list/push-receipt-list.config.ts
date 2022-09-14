/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\push-receipt-list\push-receipt-list.config.ts
 * @summary：push-receipt-list.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2022-12-28
 ***************************************************************************/
import { TabValue } from '../../../../../../shared/src/lib/config/enum/abs-gj.enum';

export enum SignStatus {
  /** 未签署 */
  NoSign = 1,
  /** 已签署 */
  Signed = 2,
}

export default class TabConfig {
  // 回执签署
  static pageConfig = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '交易状态', value: 'flowId', type: 'currentStep'},
      {label: '合同编号', value: 'contractId'},
      {label: '合同名称', value: 'contractName'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '交易金额', value: 'receive', type: 'money'},
      {label: '利率', value: 'discountRate'},
      {label: '发票号码', value: 'invoiceNum', type: 'invoiceNum'},
      {label: '发票金额', value: 'invoiceAmount', type: 'money'},
      {label: '资金渠道', value: 'channelType', type: 'moneyChannel'},
      {label: '保理融资到期日', value: 'factoringEndDate', type: 'date'},
      {label: '资产池名称', value: 'capitalPoolName'},
      {label: '渠道', value: 'productType', type: 'productType'},
      {
        label: '《应收账款转让通知书回执（适用于项目公司回复供应商通知）》', value: 'second_cdr_202_contract',
        bodyContractYyj: 'second_cdr_202_contractStatus', templateFlag: 'second_cdr_202', type: 'contract'
      },
      {
        label: '《应收账款转让通知书回执（适用于项目公司回复保理商通知）》', value: 'second_cdr_203_contract',
        bodyContractYyj: 'second_cdr_203_contractStatus', templateFlag: 'second_cdr_203', type: 'contract'
      },
      {
        label: '《买方确认函（适用于项目公司）》', value: 'second_cdr_205_contract',
        bodyContractYyj: 'second_cdr_205_contractStatus', templateFlag: 'second_cdr_205', type: 'contract'
      },

    ],
    searches: [
      {
        title: '资产池名称',
        checkerId: 'capitalPoolName',
        type: 'text',
        required: false,
        number: 1
      },
    ],
  };

  config = {
    title: '应收账款转让回执列表',
    tabList: [
      {
        label: '未签署',
        value: TabValue.First,
        canSearch: true,
        canChecked: true,
        edit: {
          headButtons: [
            {
              label: '批量签署',
              operate: 'batchSign',
              value: '/custom/jindi_v3/project/check_project_flag',
              disabled: true
            },
            {
              label: '下载附件',
              operate: 'download',
              value: '/file/downFile',
              disabled: true
            }
          ],
          rowButtons: []
        },
        searches: TabConfig.pageConfig.searches,
        headText: TabConfig.pageConfig.heads,
        get_url: '/sub_system/cdr_system/project_receipt_list',
        params: {
          projectSignStatus: SignStatus.NoSign,
        }
      },
      {
        label: '已签署',
        value: TabValue.Second,
        canSearch: true,
        canChecked: true,
        edit: {
          headButtons: [
            {
              label: '下载附件',
              operate: 'download',
              value: '/file/downFile',
              disabled: true
            }
          ],
          rowButtons: []
        },
        searches: TabConfig.pageConfig.searches,
        headText: TabConfig.pageConfig.heads,
        get_url: '/sub_system/cdr_system/project_receipt_list',
        params: {
          projectSignStatus: SignStatus.Signed,
        }
      }
    ]
  };
}

