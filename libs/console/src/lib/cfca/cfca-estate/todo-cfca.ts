
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import DragonCommBase from 'libs/shared/src/lib/public/component/comm-dragon-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/**
 *  首页代办
 */
export default class TodoCfca {
  static readonly flowId = '';
  static readonly showName = 'CFCA';
  static readonly showPage = true;
  // static readonly apiUrlBase = '/user/todo_cfca';
  static readonly apiUrlBase = '/list/todo_record/list';
  static readonly webUrlBase = ``;
  static readonly canDo = true;
  static readonly tableText = 'text-left';
  static isProxy = 52;
  // static headquarters = HeadquartersTypeEnum[5];
  // static readonly keys = ['originalSingleEencoding'];  // 根据这个数组来匹配
  /**
   * 【重要】字段默认会在new/edit/detail/list出现
   * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
   */
  static readonly fields = [
    {
      title: '企业名称', checkerId: 'orgName', memo: '', type: 'list-title',
      _inSearch: {
        number: 1,
        type: 'text',
      },
      _inList: {
        sort: false,
        search: false
      },
      _inEdit: {
        options: {
          readonly: true
        }
      }
    },
    {
      title: '审批类型', checkerId: 'reviewType', memo: '', type: 'reviewType',
      _inSearch: {
        number: 2,
        type: 'select',
        selectOptions: 'cfcaOperateType',
        // base: 'string', // 值为数
      },
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '当前步骤', checkerId: 'nowProcedureId', memo: '',
      _inSearch: {
        number: 3,
        type: 'select',
        selectOptions: 'caStatus',
      },
      _inList: false,
      type: 'select',
    },
    {
      title: '快递单号', checkerId: 'expressNum', memo: '',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '授权文件', checkerId: 'authConfirmationFile', type: 'file', memo: '',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '当前步骤', checkerId: 'nowProcedureId', memo: '', type: 'select',
      // _inSearch: false,
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },

    {
      title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'dateTime',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      },
    },
    {
      title: '状态', checkerId: 'status', memo: '', type: 'xnRecordStatus',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '创建时间', checkerId: 'createTime', memo: '', type: 'dateTime',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'dateTime',
      _inSearch: false,
      _inList: {
        sort: false,
        search: false,
      }
    },
  ];

  static readonly list = {
    onList: (base: DragonCommBase, params) => {
      // params['where'] = {
      //     flowId: Vanke.flowId
      // };
      base.onDefaultList(params);
    },
    // 分页设置
    cfcaTodo: {
      paging: 0,
      pageSize: 10,
      first: 0,
      arrObjs: {},

    },
    headButtons: [
      {
        title: '查询',
        type: 'a',
        class: 'btn btn-primary',
        search: true,
        // 如果can未定义，则默认是能显示的
        can: (base: DragonCommBase, record) => false,

        click: (base: DragonCommBase, record) => {
        }
      },
      {
        title: '重置',
        type: 'a',
        clearSearch: true,
        class: 'btn btn-danger',
        // 如果can未定义，则默认是能显示的
        can: (base: DragonCommBase, record) => false,

        click: (base: DragonCommBase, record) => {
        }
      },
    ],

    // 允许在行内根据不同条件增加行按钮
    rowButtons: [
      {
        title: '查看处理',
        type: 'a',
        // edit: 'true',
        // 如果can未定义，则默认是能显示的
        can: (base: DragonCommBase, record) => true,

        click: (base: DragonCommBase, record, xn, vcr) => {

          XnUtils.doProcess(record, xn);
        }
      }
    ],
  };

  // 只要存在detail配置就允许查看详情
  static readonly detail = false;

  // 如果没有或没权限显示add，那就不用显示新增按钮
  static readonly add = {
    can: (xn: XnService) => {
      return false;
    },
  };

  // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
  static readonly edit = {
    can: (xn: XnService, record: any) => {
      return false;
    }
  };

}
