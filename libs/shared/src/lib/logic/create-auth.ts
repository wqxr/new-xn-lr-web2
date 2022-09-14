import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';
import { XnUtils } from '../common/xn-utils';

/**
 *  审核机构
 */
export default class CreateAuth {
    static readonly flowId = '';
    static readonly showName = '审核机构';
    static readonly showPage = true;
    static readonly apiUrlBase = '/custom/record/create_auth';
    static readonly webUrlBase = ``;
    static readonly canDo = true;
    static readonly tableText = 'text-left';

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '标题', checkerId: 'title', memo: '', type: 'long-title',
            _inSearch: {
                number: 1
            },
            _inList: {
                sort: false,
                search: true
            }
        }, {
            title: '流程名', checkerId: 'flowName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '当前步骤', checkerId: 'nowProcedureName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '状态', checkerId: 'status', memo: '', type: 'xnRecordStatus',
            _inSearch: {
                number: 2,
                type: 'select',
                selectOptions: 'createStatus',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '创建时间', checkerId: 'createTime', memo: '', type: 'dateTime',
            _inSearch: {
                number: 3,
                type: 'quantum'
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '最后更新时间', checkerId: 'updateTime', memo: '', type: 'dateTime',
            _inSearch: {
                number: 4,
                type: 'quantum1'
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
    ];

    static readonly list = {
        onList: (base: CommBase, params) => {
            // params['where'] = {
            //     flowId: Vanke.flowId
            // };
            base.onDefaultList(params);
        },
        // 分页设置
        todo: {
            paging: 0,
            pageSize: 10,
            first: 0,
            arrObjs: {}
        },
        headButtons: [
            {
                title: '查询',
                type: 'a',
                class: 'btn btn-primary',
                search: true,
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            },
            {
                title: '重置',
                type: 'a',
                clearSearch: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
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
                can: (base: CommBase, record) => true,

                click: (base: CommBase, record, xn, vcr) => {
                    console.log(base, record, xn, vcr);
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
