import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

export default class CfcaSignEstateConfig {
  static Signsearch = {  // 通用签章配置项
    heads: [
      { label: '记录ID', value: 'flowName', type: 'text' },  // templateName
      {
        label: '标题', value: 'title', type: 'title',
        click: (xn: XnService, item: any) => {
          if ((item.status !== 1 && item.status !== 0)
            || !XnUtils.getRoleExist(item.nowRoleId, xn.user.roles, item.proxyType)) {
            xn.router.navigate([`/logan/record/todo/view/${item.recordId}`]);
          } else {
            xn.router.navigate([`/logan/record/todo/edit/${item.recordId}`]);

          }
        }
      },  // templateName
      { label: '当前步骤', value: 'nowProcedureId', type: 'nowProcedureId' },
      {
        label: '创建时间', value: 'createTime', type: 'longDateTime', _inList: {
          sort: true,
          search: true
        }
      },
      {
        label: '最后更新时间', value: 'updateTime', type: 'longDateTime', _inList: {
          sort: true,
          search: true
        }
      },
    ],
    searches: [
      {
        title: '当前步骤',
        checkerId: 'nowProcedureId',
        type: 'select',
        required: false,
        options: { ref: 'caStatus' }
      },
    ],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    cfcaSignEstatesearch: {
      title: '通用签章列表',
      value: 'cfca-sign-list',
      tabList: [
        {
          label: '',
          value: 'A',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                leftheadButtons: [
                ],
                headButtons: [
                ],
                rowButtons: [
                  {
                    label: '查看处理',
                    operate: 'view',
                    post_url: '',
                    click: (xn: XnService, item: any) => {
                      if ((item.status !== 1 && item.status !== 0)
                        || !XnUtils.getRoleExist(item.nowRoleId, xn.user.roles, item.proxyType)) {
                        xn.router.navigate([`/logan/record/todo/view/${item.recordId}`]);
                      } else {
                        xn.router.navigate([`/logan/record/todo/edit/${item.recordId}`]);

                      }
                    }
                  },
                ]
              },
              searches: CfcaSignEstateConfig.Signsearch.searches,
              headText: CfcaSignEstateConfig.Signsearch.heads,
            }
          ],
          post_url: '/list/todo_record/list',
          params: 1
        },
      ]
    } as TabConfigModel
  };
  static getConfig(name) {
    return this.config[name];
  }
}
