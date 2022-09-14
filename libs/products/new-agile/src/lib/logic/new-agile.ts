import CommBase from '../comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/**
 * 雅居乐-星顺 abs
 * base: src\app\logic\vanke.ts
 */
export default class NewAgile {
    static readonly flowId = 'financing_pre18';
    static readonly showName = '雅居乐(星顺)-房地产供应链标准保理';

    static readonly showPage = true;

    static readonly canSearch = false;

    static readonly canDo = true;

    static readonly apiUrlBase = '/record/record';

    static readonly webUrlBase = `/console/record/record-vanke/${NewAgile.flowId}}`;

    // static readonly keys = ['originalSingleEencoding'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '流程记录ID', checkerId: 'recordId', memo: '', type: 'list-title',
            _inSearch: {
                number: 1,
                type: 'text'
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
            title: '流程名', checkerId: 'flowName', memo: '',
            _inSearch: false,
            _inList: {
                sort: true,
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
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        // {
        //     title: '总部公司', checkerId: 'headquarters', memo: '',
        //     _inSearch: {
        //         number: 2,
        //         type: 'text'
        //     },
        //     _inList: {
        //         sort: false,
        //         search: false,
        //     }
        // },
        {
            title: '登记编码', checkerId: 'registerMa', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '修改码', checkerId: 'editMa', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '完成度', checkerId: 'wcd', memo: '',
            _inSearch: false,
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
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        }
    ];

    static readonly list = {
        pageSize: 10,

        onList: (base: CommBase, params) => {
            console.log('params :>> ', params);
            if (params.where && params.where._complex) {
                params.where = {
                    flowId: NewAgile.flowId,
                    ...params.where
                };
            } else {
                params.where = {
                    flowId: NewAgile.flowId
                };
            }

            // params['where'] = {
            //     flowId: NewAgile.flowId
            // };
            base.onDefaultList(params);
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
            }, {
                title: '发起交易申请',
                type: 'a',
                customClick: true,
                class: 'btn btn-danger',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (xn: XnService, base: CommBase) => {
                    xn.router.navigate([`/new-agile/record/new/${NewAgile.flowId}`]);
                }
            }
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
                    if ((record.status !== 1 && record.status !== 0) || xn.user.roles.indexOf(record.nowRoleId) < 0) {
                        xn.router.navigate([`/new-agile/record/${NewAgile.flowId}/view/${record.recordId}`]);
                    } else {
                        xn.router.navigate([`/new-agile/record/${NewAgile.flowId}/edit/${record.recordId}`]);
                    }
                }
            },
            // {
            //     title: '录入登记编码',
            //     type: 'edit',
            //     // 如果can未定义，则默认是能显示的
            //     can: (base: CommBase, record) => true,

            //     edit: (record, xn) => {
            //         return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
            //     },

            //     click: (base: CommBase, record, xn, vcr) => {
            //         xn.router.navigate(['console/record/new'],
            //             { queryParams: { 'id': 'entry_registration18', 'relate': 'relatedRecordId', 'relateValue': record.recordId } });
            //     }
            // },
            {
                title: '出让人信息表',
                type: 'edit',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                edit: (record, xn) => {
                    return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
                },

                click: (base: CommBase, record, xn, vcr) => {
                    xn.router.navigate(['new-agile/record/new'],
                        {
                            queryParams: {
                                id: 'assignor_information_registration18',
                                relate: 'relatedRecordId',
                                relateValue: record.recordId
                            }
                        });
                }
            },
            {
                title: '应收账款转让信息',
                type: 'edit',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                edit: (record, xn) => {
                    return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
                },

                click: (base: CommBase, record, xn, vcr) => {
                    xn.router.navigate(['new-agile/record/new'],
                        { queryParams: {
                            id: 'entry_registration_code18',
                            relate: 'relatedRecordId',
                            relateValue: record.recordId
                        } });
                }
            },
            {
                title: '导出中登登记附件',
                type: 'edit',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                edit: (record, xn) => {
                        return true;
                    // return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1 && record.headquarters
                    //     && (record.headquarters.includes('万科') || record.headquarters.includes('雅居乐'));
                },

                click: (base: CommBase, record, xn, vcr) => {
                    const time = new Date().getTime();
                    xn.api.download('/custom/jindi_v3/down_file/download_zd',
                        {flowId: record.flowId, recordId: record.recordId}).subscribe((v: any) => {
                            xn.api.save(v._body, `${record.recordId}-${time}.xlsx`);
                        }, err => {
                        }, () => {
                           xn.loading.close();
                        });
                }

            },
            // {
            //     title: '上传付款确认书',
            //     type: 'edit',
            //     // 如果can未定义，则默认是能显示的
            //     can: (base: CommBase, record) => true,

            //     edit: (record, xn) => {
            //         return (record.status === 2) && xn.user.roles.indexOf(record.nowRoleId) > -1;
            //     },

            //     click: (base: CommBase, record, xn, vcr) => {
            //         console.log('记录信息：', record);
            //         xn.router.navigate(['new-agile/record/new'],
            //             { queryParams: {
            //                 'id': 'pay_confirm18',
            //                 'relate': 'relatedRecordId',
            //                 'relateValue': record.recordId } });
            //     }
            // }
        ],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = false;

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitAdd();
        // }
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };
}
