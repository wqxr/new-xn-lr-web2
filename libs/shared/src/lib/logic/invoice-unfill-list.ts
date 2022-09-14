import { XnModalUtils } from './../common/xn-modal-utils';
import { XnService } from './../services/xn.service';
import CommBase from '../public/component/comm-base';
import { InvoiceFactoryEditModalComponent } from '../public/modal/invoice-factory-edit-modal.component';

export default class InvoiceUnfillList {
    static readonly showName = '待补发票';

    static readonly showPage = true; // 显示分页
    static readonly canDo = true;

    // static readonly showMore = true; // 显示更多的按钮

    static readonly apiUrlBase = '/invoice_upload/list';

    static readonly apiUrlDetail = '/flow/main/detail';

    static readonly webUrlBase = '/console/invoice-unfill-list/';

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '主流程ID', checkerId: 'mainFlowId', memo: '',
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
            title: '核心企业', checkerId: 'enterpriseOrgName', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            }
        },
        {
            title: '现有发票(元)', checkerId: 'invoiceAmounts', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '待补发票(元)', checkerId: 'unInvoiceAmounts', memo: '', type: 'money',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '保理日期', checkerId: 'payTime', memo: '', type: 'date',
            _inSearch: {
                number: 1,
                type: 'quantum'
            },
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
        {
            title: '保理到期日', checkerId: 'factoringDate', memo: '', type: 'stringToDate',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inNew: false
        },
    ];

    static readonly list = {
        pageSize: 10,

        // onList: (base: CommBase, params) => {
        //     base.onMoreList(params);
        // },

        // 暂未实现
        headButtons: [

        ],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [
            {
                title: '查看',
                type: 'a',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => true,

                click: (base: CommBase, record, xn, vcr) => {
                    // console.log('test click', record);
                    XnModalUtils.openInViewContainer(xn, vcr, InvoiceFactoryEditModalComponent, record).subscribe(v => {
                        base.spliceItem(v);
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
