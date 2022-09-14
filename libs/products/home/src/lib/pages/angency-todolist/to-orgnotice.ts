import { XnService } from 'libs/shared/src/lib/services/xn.service';
import NoticeCommBase from './comm-notice-base';

/**
 *  首页-提醒待办列表（中介机构）
 */
export default class orgNoticeToDo {
    static readonly flowId = '';
    static readonly showName = '提醒任务';
    static readonly showPage = true;
    static readonly apiUrlBase = '/user/todo';
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
            title: '记录ID', checkerId: 'id', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
        },
        {
            title: '提醒事项名称', checkerId: 'title', memo: '',
            _inSearch: {
                number: 3,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '提醒详细内容', checkerId: 'remindContent', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '提醒反馈', checkerId: 'feedback', memo: '', type: 'feedback',
            _inSearch: {
                number: 5,
                type: 'select',
                selectOptions: 'feedback',
                base: 'number', // 值为数
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '是否反馈', checkerId: 'remindStatus', memo: '', type: 'defaultRadio',
            _inSearch: {
                number: 4,
                type: 'select',
                selectOptions: 'defaultRadio',
                base: 'number', // 值为数
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '总部公司', checkerId: 'headquarters', memo: '',
            _inSearch: {
                number: 1,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '资产池名称', checkerId: 'capitalPoolName', memo: '',
            _inSearch: {
                number: 2,
                type: 'text',
            },
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '提醒时间', checkerId: 'remindTime', memo: '', type: 'dateTime',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
    ];

    static readonly list = {
        onList: (base: NoticeCommBase, params) => {
            // params['where'] = {
            //     flowId: Vanke.flowId
            // };
            base.onDefaultList(params);
        },
        // 分页设置
        orgNoticeToDo: {
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
                can: (base: NoticeCommBase, record) => false,

                click: (base: NoticeCommBase, record) => {
                    console.log('test click', record);
                }
            },
            {
                title: '重置',
                type: 'a',
                clearSearch: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: NoticeCommBase, record) => false,

                click: (base: NoticeCommBase, record) => {
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
                can: (base: NoticeCommBase, record) => true,

                click: (base: NoticeCommBase, record, xn, vcr) => {
                    console.log(base, record, xn, vcr);
                    //查看提醒
                    xn.router.navigate([`home/view-remind`], {
                        queryParams: {
                            params: JSON.stringify(record)
                        }
                    });
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
