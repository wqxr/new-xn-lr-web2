import { XnService } from './../services/xn.service';
import CommBase from '../public/component/comm-base';

export default class GemdaleSupport {
    static readonly showName = '总部支持函';

    static readonly showPage = false;

    static readonly apiUrlBase = '/jzn/jd/get';

    static readonly webUrlBase = '/console/gendale-supports';

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '基础交易合同编号', checkerId: 'contractId', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '发票号码', checkerId: 'invoiceNum', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '真实交易发票号', checkerId: 'invoiceNumReal', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '发票总金额', checkerId: 'invoiceAmount', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '真实交易发票总金额', checkerId: 'invoiceAmountReal', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '应收账款金额', checkerId: 'receivable', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '应收账款到期日', checkerId: 'expiryTime', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债权单位名称', checkerId: 'debtUnit', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债权单位联系人', checkerId: 'debtUser', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债权单位联系人手机号', checkerId: 'mobile', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债权单位银行账户', checkerId: 'debtAccount', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债权单位银行开户行', checkerId: 'debtBank', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '债务单位名称', checkerId: 'projectCompany', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },
        {
            title: '付款确认书编号', checkerId: 'originalSingleEencoding', memo: '',
            _inSearch: false,
            _inList: true,
            _inNew: false
        },

    ];

    static readonly list = {
        pageSize: 10,

        onList: (base: CommBase, params) => {
            base.onDefaultList({});
        },

        headButtons: [
            {
                title: '下载融资详情',
                type: 'a',
                customClick: false,
                class: 'btn btn-primary',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (xn, base: CommBase) => {

                    // 拼接文件名
                    const appId = xn.user.appId;
                    const orgName = xn.user.orgName;
                    const time = new Date().getTime();
                    const filename = appId + '-' + orgName + '-' + time + '.xlsx';

                    xn.api.download('/jzn/jd/excel_export', {

                    }).subscribe((v: any) => {
                        xn.api.save(v._body, filename);
                    });
                }
            },
            {
                title: '签署付款确认书',
                type: 'a',
                link: true,
                href: '/console/record/new/financing_jd5',
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
                title: '测试',
                type: 'a',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (base: CommBase, record) => {
                    console.log('test click', record);
                }
            },

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
