import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';
import { XnUtils } from '../common/xn-utils';
/**
 *  首页采购融资代办
 */
export default class TodoAvenger {
    static readonly flowId = '';
    static readonly showName = '待办';
    static readonly showPage = true;
    static readonly apiUrlBase = '/list/todo_record/list';
    static readonly isAvengerBusiness = true; // 是否采购融资待业务
    static readonly webUrlBase = ``;
    static readonly canDo = true;
    static readonly tableText = 'text-left';
    // static readonly keys = ['originalSingleEencoding'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '记录ID', checkerId: 'flowName', memo: '', type: 'list-title',
            _inSearch: false,
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
            title: '标题', checkerId: 'title', memo: '', type: 'long-title',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '交易类型', checkerId: 'isProxy', memo: '', type: 'spIsProxys',
            _inSearch: {
                number: 1,
                type: 'select',
                selectOptions: 'spIsProxys',
                base: 'number', // 值为数
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '当前步骤', checkerId: 'nowProcedureName', memo: '',
            _inSearch: {
                number: 2,
                type: 'select',
                selectOptions: 'todoSteps',
            },
            _inList: {
                sort: false,
                search: false,
            }
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
        onList: (base: CommBase, params) => {
            const postparams = {
                start: params.start,
                length: params.length,
                sign: params.sign,
                t: params.t,
                isProxy: params.where ? params.where._complex.isProxy : null,
                nowProcedureName: params.where ? params.where._complex.nowProcedureName : null,
            };
            base.onDefaultList(postparams);
        },
        // 分页设置
        avengerTodo: {
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
