import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
// 发票查验表格配置
export default class BankAccountManageTabConfig {
  static bankAccountManage = {
    heads: [
      { label: '银行名称', value: 'bankHead', type: 'text', _inList: { sort: true }, width: '200px' },
      { label: '开户行名称', value: 'bankName', type: 'text', _inList: { sort: true }, width: '300px' },
      { label: '开户行行号', value: 'bankId', type: 'text', width: '100px' },
      { label: '开户行省', value: 'province', type: 'text' },
      { label: '开户行市', value: 'city', type: 'text' },
    ],
    searches: [
      {
        title: '银行名称',
        checkerId: 'bankHead',
        type: 'text',
        placeholder: '请输入银行名称',
        required: false,
      },
      {
        title: '开户行名称',
        checkerId: 'bankName',
        type: 'text',
        placeholder: '请输入开户行名称',
        required: false,
      },
      {
        title: '开户行行号',
        checkerId: 'bankId',
        type: 'text',
        placeholder: '请输入开户行行号',
        required: false,
      },
      {
        title: '开户行省市',
        checkerId: 'address',
        type: 'linkage-select',
        required: false,
        options: {
          ref: 'province_and_city',
          firstPlaceholder: '-请选择省份-',
          firstProp: 'province',
          secondPlaceholder: '-请选择城市-',
          secondProp: 'city',
        },
      },
    ],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    bankAccountManage: {
      title: '银行账户维护',
      value: 'bank-account-manage',
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
                headButtons: [],
                rowButtons: [],
              },
              searches: BankAccountManageTabConfig.bankAccountManage.searches,
              headText: [...BankAccountManageTabConfig.bankAccountManage.heads],
            }
          ],
          post_url: '/bank_info_list/search'
        },
      ]
    } as TabConfigModel
  };
  static getConfig(name) {
    return this.config[name];
  }
}
