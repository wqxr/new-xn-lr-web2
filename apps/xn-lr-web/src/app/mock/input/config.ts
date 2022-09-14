import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

export const config: MockInputConfig = {
    formModule: 'dragon-input',
    checks: [{
        title: '保理商',
        checkerId: 'contractNum',
        type: 'text-code',
        required: false,
        value: ''
    },
    {
        title: '申请付款单位',
        checkerId: 'contractAmt',
        type: 'text-pic',
        required: false,
        value: ''
    },
    {
        title: '项目名称',
        checkerId: 'contractName',
        required: false,
        type: 'company-upload',
        value: ''
    },
    {
        title: '应收账款金额',
        checkerId: 'contractJia',
        type: 'machine-loandate',
        required: false,
        value: ''
    },
    {
        title: '收款账户信息',
        checkerId: 'contractJiesuan',
        type: 'account-info',
        required: 0,
        value: ''
    },
    {
        title: '交易合同',
        checkerId: 'contractYi',
        type: 'deal-contract',
        required: true,
        value: ''
    },
    {
        title: '发票',
        checkerId: 'contractPayTime ',
        type: 'invoice-normal',
        required: 0,
        options: { 'fileext': 'jpg, jpeg, png, pdf', 'picSize': 500, 'helpType': 1, 'helpMsg': 'xxxx' },
        value: ''
    },
    {
        title: '资质证明',
        checkerId: 'receive',
        type: 'mfile',
        required: 0,
        options: { 'fileext': 'jpg, jpeg, png, pdf', 'picSize': 500, 'helpType': 1, 'helpMsg': 'xxxx' },
        value: ''
    },
    {
        title: '供应商其他文件',
        checkerId: 'receive',
        type: 'mfile',
        required: 0,
        options: { 'fileext': 'jpg, jpeg, png, pdf', 'picSize': 500, 'helpType': 1, 'helpMsg': 'xxxx' },
        value: ''
    },
        {
            title: '供应商公司章程/股东会/董事会决议',
            checkerId: 'mfile',
            required: false,
            type: 'mfile-info',
            value: '[{"fileId":"15674_1565681239503_pastFile.png","fileName":"认证.png","filePath":"/data/xn-lr-server-dev/runtime/upload/15674_1565681239503_pastFile.png"},{"fileId":"15674_1565681239503_pastFile.png","fileName":"wq.png","filePath":"/data/xn-lr-server-dev/runtime/upload/15674_1565681239503_pastFile.png"}]',

        },
        {
            title: '营业执照',
            checkerId: 'mfile',
            required: false,
            type: 'mfile-info',
            value: '[{"fileId":"15674_1565681239503_pastFile.png","fileName":"认证.png","filePath":"/data/xn-lr-server-dev/runtime/upload/15674_1565681239503_pastFile.png"}]',
        },
        {
            title: '交易合同',
            checkerId: 'mfile',
            required: false,
            type: 'plat-contract',
            value: '',
        },
        {
            title: '发票号码',
            checkerId: 'invoice-transfer',
            required: false,
            type: 'invoice-transfer',
            value: '',
        },
        // {
        //     title: '应收账款类型',
        //     checkerId: 'receiveType',
        //     type: 'moreselect',
        //     required: 0,
        //     options: { ref: 'moneyType' },
        //     value: { twoselect: '', threeselect: '', valueinfo: JSON.stringify({}) } as any
        // },
        // {
        //     title: '合同',
        //     checkerId: 'contractDownstream',
        //     type: 'contractDownstream',
        //     required: 0,
        //     value: JSON.stringify([]),
        // }]
    ]
};

interface MockInputConfig {
    /** 动态表单模块名称 */
    formModule: string;
    /** 表单 checks 配置 */
    checks: CheckersOutputModel[];
}
