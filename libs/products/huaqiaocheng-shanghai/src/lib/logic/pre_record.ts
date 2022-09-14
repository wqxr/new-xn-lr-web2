/*
 * @Description: 上传付款计划
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2021-01-06 15:39:01
 * @LastEditors: yutianbao
 * @LastEditTime: 2021-09-02 09:42:02
 * @FilePath: \xn-lr-web2\libs\products\huaqiaocheng-shanghai\src\lib\logic\pre_record.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

export default class PreRecordConfig {
  // 列表表头,搜索项配置
  static preRecordlist = {
      heads: [
          { label: '流程记录ID', value: 'recordId', type: 'text', width: '15%' },
          { label: '流程名', value: 'flowName', type: 'flowName', width: '10%' },
          { label: '当前步骤', value: 'nowProcedureName', type: 'text', width: '6%'  },
          { label: '状态', value: 'status', type: 'xnRecordStatus', width: '6%'  },
          { label: '总部公司', value: 'headquarters', type: 'text', width: '13%'  },
          { label: '登记编码/修改码', value: 'zdList', type: 'zdList', width: '9%'  },
          { label: '完成度', value: 'donePercent', type: 'text', width: '6%'  },
          { label: '创建时间', value: 'createTime', type: 'dateTime', width: '10%'  },
          { label: '最后更新时间', value: 'updateTime', type: 'dateTime', width: '10%'  }
      ] as ListHeadsFieldOutputModel[],
      searches: [
          { title: '流程记录ID', checkerId: 'recordId', type: 'text', required: false, sortOrder: 1 },
          { title: '创建时间', checkerId: 'createTime', type: 'quantum1', required: false, sortOrder: 2 },
          { title: '状态', checkerId: 'status', type: 'select', options: {
            ref: 'createStatus' }, required: false, sortOrder: 3, base: 'number' },
      ] as CheckersOutputModel[]
  };
  static readonly config = {
    preRecordlist: {
      title: '上传付款计划列表',
      value: 'preRecordlist',
      tabList: [
          {
              label: '上传付款计划列表',
              value: 'A',
              subTabList: [
                  {
                      label: '未上传',
                      value: 'DOING',
                      canSearch: true,
                      canChecked: false,
                      edit: {
                          headButtons: [],
                          rowButtons: [
                            { label: '查看处理', operate: 'view_do', post_url: '' },
                          ]
                      },
                      searches: [...PreRecordConfig.preRecordlist.searches],
                      params: 1,
                      searchNumber: 8,
                      headNumber: 7,
                      headText: [...PreRecordConfig.preRecordlist.heads],
                  },
              ] as SubTabListOutputModel[],
              post_url: '/pay_plan/list'
          },
      ] as TabListOutputModel[]
    }
  };
  static getConfig(name) {
      return this.config[name];
  }
}
