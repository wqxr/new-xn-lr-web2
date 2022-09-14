import { Column, ColumnButton, TableData } from '@lr/ngx-table';
import { ButtonConfigs } from 'libs/products/bank-shanghai/src/lib/logic/table-button.interface';

// 列表配置
export default class AntTableListConfig {

  // 上海银行复核-基础资料
  static baseFile = {
    // 表格头部按钮配置
    tableHeadBtn: {
      left: [
        { label: '更新信息', type: 'text', btnKey: 'basicUpdateInfo'},
      ],
      right: [
        { label: '全部下载', type: 'normal', btnKey: 'basicInfoAllDownload', icon: 'download' },
      ]
    } as ButtonConfigs,
    columns: [
      { title: '序号', index: 'no', width: '15%', format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
      { title: '内容', index: 'fileInfo', render: 'baseFileTpl', width: '30%' }
    ] as Column[]
  };

  // 上海银行复核-交易合同
  static dealContract = {
    // 表格头部按钮配置
    tableHeadBtn: {
      left: [],
      right: [
        { label: '全部下载', type: 'normal', btnKey: 'contractAllDownload', icon: 'download' },
      ]
    } as ButtonConfigs,
    columns: [
      { title: '序号', index: 'no', width: '5%', format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
      { title: '合同编号', index: 'contractId', width: '25%' },
      { title: '合同名称', index: 'contractName', width: '25%' },
      { title: '合同金额(元)', index: 'contractMoney', width: '25%', render: 'moneyTpl' },
      { title: '合同类型', index: 'contractType', width: '10%', render: 'contractTypeTpl' },
    ] as Column[]
  };

  // 上海银行复核-发票；列表
  static invoice = {
    // 表格头部按钮配置
    tableHeadBtn: {
      left: [],
      right: [
        { label: '全部下载', type: 'normal', btnKey: 'invoiceAllDownload', icon: 'download' }
      ]
    } as ButtonConfigs,
    columns: [
      { title: '序号', index: 'no', width: '5%', format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
      { title: '文件名称', index: 'fileName', width: '20%' },
      { title: '发票号码', index: 'invoiceNum', width: '9%' },
      { title: '发票代码', index: 'invoiceCode', width: '9%' },
      { title: '开票日期', index: 'invoiceDate', width: '8%', render: 'singleDateTpl' },
      { title: '含税金额(元)', index: 'invoiceAmount', width: '13%', render: 'moneyTpl', key: 'invoiceAmount', statistical: 'sum' },
      { title: '不含税金额(元)', index: 'amount', width: '13%', render: 'moneyTpl', key: 'amount', statistical: 'sum' },
      { title: '发票转让金额(元)', index: 'transferMoney', width: '13%', render: 'moneyTpl', key: 'transferMoney', statistical: 'sum' },
    ] as Column[],
  };

  static getConfig(name: string) {
    return AntTableListConfig[name];
  }
}
