import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
// 发票查验表格配置
export default class InvoiceCheckListData {
  static invoiceCheck = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'text', _inList: { sort: true }, merge: true },
      { label: '付款确认书编号', value: 'payConfirmId', type: 'text', _inList: { sort: true }, merge: true },
      { label: '总部公司', value: 'headquarters', type: 'text', merge: true },
      { label: '项目公司名称', value: 'projectCompany', type: 'text', merge: true },
      { label: '供应商名称', value: 'debtUnit', type: 'text', merge: true },
      { label: '应收账款金额', value: 'receive', type: 'money', merge: true },
      { label: '渠道', value: 'productType', type: 'productType' },
      { label: '起息日', value: 'valueDate', type: 'date' },
      { label: '发票类型', value: 'invoiceType', type: 'invoiceType' },
      { label: '发票代码', value: 'invoiceCode', type: 'text' },
      { label: '发票号码', value: 'invoiceNum', type: 'text' },
      { label: '开票时间', value: 'invoiceDate', type: 'date' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '发票校验码', value: 'checkCode', type: 'text' },
      { label: '发票转让金额', value: 'transferMoney', type: 'money' },
      { label: '发票查验状态', value: 'checkStatus', type: 'checkStatus' },
      { label: '发票查验时间', value: 'lastCheckTime', type: 'dateTime' },
    ],
    searches: [
      {
        title: '交易ID',
        checkerId: 'mainFlowId',
        type: 'text',
        placeholder: '请输入交易ID',
        required: false,
        options: {
          enter: 'segmentation',
        },
      },
      {
        title: '付款确认书编号',
        checkerId: 'payConfirmId',
        type: 'text',
        placeholder: '请输入付款确认书编号',
        required: false,
        options: {
          enter: 'segmentation',
        },
      },
      {
        title: '发票号码',
        checkerId: 'invoiceNum',
        type: 'text',
        placeholder: '请输入发票号码',
        required: false,
        options: {
          enter: 'segmentation',
        },
      },
      {
        title: '发票查验状态',
        checkerId: 'checkStatus',
        type: 'select',
        options: {
          ref: 'invoiceCheckStatus',
        },
        placeholder: '请选择',
        required: false,
      },
      {
        title: '供应商名称',
        checkerId: 'debtUnit',
        type: 'text',
        placeholder: '请输入供应商名称',
        required: false,
      },
      {
        title: '项目公司名称',
        checkerId: 'projectCompany',
        type: 'text',
        placeholder: '请输入项目公司名称',
        required: false,
      },
      {
        title: '总部公司',
        checkerId: 'headquarters',
        type: 'select',
        options: {
          ref: 'enterprise_dragon_all',
        },
        placeholder: '请输入总部公司',
        required: false,
      },
      {
        title: '起息日',
        checkerId: 'valueDate',
        type: 'quantum1',
        placeholder: '请输入起息日',
        required: false,
      },
      {
        title: '渠道',
        checkerId: 'productType',
        type: 'linkage-select',
        options: {
          ref: 'productType_dw',
          firstProp: 'type',
          secondProp: 'selectBank',
        },
        placeholder: '请输入总部公司',
        required: false,
      },
    ],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    invoiceCheck: {
      title: '发票查验',
      value: 'invoice-check',
      tabList: [
        {
          label: '',
          value: 'A',
          subTabList: [
            {
              label: '',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                headButtons: [
                  {
                    label: '导出',
                    operate: 'export',
                    post_url: '',
                    disabled: false,
                  },
                  {
                    label: '发票查验',
                    operate: 'check',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: []
              },
              searches: InvoiceCheckListData.invoiceCheck.searches,
              headText: [...InvoiceCheckListData.invoiceCheck.heads],
            }
          ],
          post_url: '/invoice/list_invoices'
        },
      ]
    } as TabConfigModel
  };
  static getConfig(name) {
    return this.config[name];
  }
}
