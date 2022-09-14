export const config: MockShowConfig = {
    formModule: 'dragon-show',
    checks: [{
        checkerId: '保理商',
        data: '',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '{"readonly":true}',
        required: 1,
        title: '保理商名称',
        type: 'company-upload',
        validators: ''
    }, {
        checkerId: 'signGuide',
        data: '800,00',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '{"readonly":true}',
        required: 0,
        title: '应收账款金额',
        type: 'money',
        validators: ''
    },
    {
        checkerId: 'signGuide',
        data: '{"name":"单个","account":"科技对方","bank":"电饭锅"}',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '{"readonly":true}',
        required: 0,
        title: '收款账户信息',
        type: 'account-info',
        validators: ''
    },
    {
        checkerId: 'signGuide',
        data: '[{"contractName":"采购0002","contractMoney":"5000000.00","contractId":"123"}]',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '',
        required: 0,
        title: '交易合同',
        type: 'deal-contract',
        validators: ''
    },
    {
        checkerId: 'signGuide',
        data: '[{"invoiceNum":"345345345","invoiceCode":"435353","invoiceDate":"20180930","invoiceAmount":"324232","noinvoiceAmount":"3242","status":"dsfa","fileId":"342"}]',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '',
        required: 0,
        title: '发票号码',
        type: 'invoice-normal',
        validators: ''
    },
    {
        checkerId: 'supplierOtherFile',
        default: '',
        defaultMode: 0,
        flowId: 'data_verification_500',
        options: '{"readonly":true}',
        required: 0,
        title: '万科供应商其他文件',
        type: 'mfile-info',
        validators: '',
        data: '[{"fileId":"15674_1565681239503_pastFile.png","fileName":"认证.png","filePath":"/data/xn-lr-server-dev/runtime/upload/15674_1565681239503_pastFile.png"},{"fileId":"15674_1565681239503_pastFile.png","fileName":"wq.png","filePath":"/data/xn-lr-server-dev/runtime/upload/15674_1565681239503_pastFile.png"}]'
    },
    {
        checkerId: 'signGuide',
        data: '',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '{"readonly":true}',
        required: 0,
        title: '发票号码',
        type: 'invoice-transfer',
        validators: ''
    },
    {
        checkerId: 'signGuide',
        data: '',
        default: '',
        defaultMode: 0,
        flowId: 'supplier_sign_510',
        options: '{"readonly":true}',
        required: 0,
        title: '交易合同',
        type: 'plat-contract',
        validators: ''
    },
    ]
};

interface MockShowConfig {
    /** 动态表单模块名称 */
    formModule: string;
    /** 表单 checks 配置 */
    checks: {
        checkerId: string,
        data: string,
        default: string,
        defaultMode: number,
        flowId: string,
        options: { ref: string } | string,
        required: number,
        title: string,
        type: string,
        validators: string
    }[];
}
