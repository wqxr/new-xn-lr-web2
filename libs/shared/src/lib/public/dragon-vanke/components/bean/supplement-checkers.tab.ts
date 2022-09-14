import { CheckersOutputModel } from '../../../../config/checkers';
import { HeadquartersTypeEnum, SelectOptions } from '../../../../config/select-options';
import * as moment from 'moment';

// 合同补录、履约证明补录checker配置
export default class ContractAndPerformanceSupply {
    // 公共配置
    static common = {
        searches: [
            {
                title: '合同签订时间',
                checkerId: 'signTime',
                type: 'date4',
                required: 0,
                options: { readonly: false },
                value: '',
                placeholder:'请选择或输入时间，格式20210101',
                sortOrder: 6
            },
            {
                title: '累计确认产值',
                checkerId: 'totalReceive',
                required: 0,
                type: 'money',
                options: { readonly: false },
                value: '',
                sortOrder: 9
            },
            {
                title: '基础合同-收款单位户名',
                checkerId: 'debtUnitName',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 12
            },
            {
                title: '基础合同-收款单位开户行',
                checkerId: 'debtUnitBank',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 13
            },
            {
                title: '基础合同-收款单位账号',
                checkerId: 'debtUnitAccount',
                required: 0,
                type: 'text',
                options: { readonly: false },
                value: '',
                sortOrder: 14
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: '',
                sortOrder: 15
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: '',
                sortOrder: 16
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                required: 0,
                type: 'text',
                options: { readonly: true },
                value: '',
                sortOrder: 17
            },

            {
                title: '合同名称',
                checkerId: 'contractName',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 1
            },
            {
                title: '合同编号',
                checkerId: 'contractId',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 2
            },
            {
                title: '合同金额',
                checkerId: 'contractMoney',
                required: 0,
                type: 'money',
                options: { readonly: false },
                value: '',
                sortOrder: 3
            },
            {
                title: '付款比例',
                checkerId: 'payRate',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                memo: '',
                sortOrder: 4
            },
            {
                title: '合同类型',
                checkerId: 'contractType',
                type: 'select',
                required: 0,
                options: { ref: 'dragonContracttype', readonly: false },
                validators: {},
                value: '',
                sortOrder: 5
            },
            {
                title: '基础合同甲方名称',
                checkerId: 'contractJia',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 7
            },
            {
                title: '基础合同乙方名称',
                checkerId: 'contractYi',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 8
            },
            {
                title: '本次产值金额',
                checkerId: 'percentOutputValue',
                type: 'money',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 10
            },
            {
                title: '本次付款性质',
                checkerId: 'payType',
                type: 'select',
                required: 0,
                options: { ref: 'payType', readonly: false },
                value: '',
                memo: '',
                sortOrder: 11
            },
            {
                title: '交易合同列表序号',
                checkerId: 'index',
                required: 0,
                type: 'text',
                options: { readonly: true },
                value: '',
                sortOrder: 18
            },
        ] as CheckersOutputModel[]
    };
    /**
     * 获取配置
     * @param name 根据name获取不同配置
     * @param type 1->查看只读  2->可编辑
     * @param obj /contract_temporary/view返回数据
     * @param row 流程信息
     */
    static getConfig(name: string, type: number, obj: any, row: any): any[] {
        const shows = $.extend(true, [], ContractAndPerformanceSupply.common.searches.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
        })); // 深拷贝，并排序;
        shows.forEach(show => {
            if (!(['index', 'receive', 'projectCompany', 'debtUnit'].includes(show.checkerId))) {
                show.options.readonly = type === 1 ? true : false;
            }
            if (show.checkerId === 'index' && (name === 'dragonContract' || name === 'vankeContract')) {
                show.title = '交易合同列表序号';
            } else if (show.checkerId === 'index' && (name === 'dragonLvYue' || name === 'vankeLvYue')) {
                show.title = '履约证明列表序号';
            }
            if (show.checkerId === 'signTime') {
                show.value = !!obj[show.checkerId] ? moment(obj[show.checkerId]).format('YYYYMMDD') : '';
            } else {
                show.value = obj[show.checkerId] || '';

            }
        });
        let requireArray = [];

        switch (name) {
            case 'dragonContract':
                requireArray = ['contractMoney', 'payRate', 'contractType', 'contractJia', 'contractYi'];
                break;
            case 'dragonLvYue':
                requireArray = [];
                break;
            // 新万科交易合同补录弹框配置
            case 'vankeContract':
                requireArray = ['contractName', 'contractId', 'contractMoney', 'payRate', 'contractType', 'contractJia', 'contractYi'];
                break;
            // 新万科履约证明补录弹框配置
            case 'vankeLvYue':
                requireArray = ['percentOutputValue', 'payType'];
                break;
            default:
                requireArray = [];
        }
        
        shows.forEach(show => {
            if (requireArray.includes(show.checkerId)) {
                show.required = true;
            }
            if (obj.wkType && obj.wkType === 1 && row.flowId === 'vanke_platform_verify' && (name === 'vankeContract' || name === 'vankeLvYue') && show.checkerId === 'payType') {
                // 渠道为“abs、非标”时，可选项为“进度款、结算款、其他”；渠道为“再保理”时，可选项为“进度款、结算款、质保金、预付款、其他”
                if (String(obj.type) === '1' || String(obj.type) === '99') {
                    show.options.ref = 'payType';
                    show.value = !!show.value ? show.value : ContractAndPerformanceSupply.getPayType('payType', obj.feeTypeName);
                    show.memo = '万科原始数据款项类型：' + obj.feeTypeName;
                } else if (String(obj.type) === '2') {
                    show.options.ref = 'vankePayType';
                    show.value = !!show.value ? show.value : ContractAndPerformanceSupply.getPayType('vankePayType', obj.feeTypeName);
                    show.memo = '万科原始数据款项类型：' + obj.feeTypeName;
                }
            }
            if (obj.wkType && obj.wkType === 1 && row.flowId === 'jd_platform_verify' && obj.headquarters === HeadquartersTypeEnum[2]
                && (name === 'vankeContract' || name === 'vankeLvYue') && show.checkerId === 'contractType') {
                // 金地线上提单 展示金地原始合同类型提示
                show.memo = '金地原始数据合同类型：' + obj.contractTypeJd;
            }
            if (obj.wkType && obj.wkType === 1 && row.flowId === 'jd_platform_verify' && obj.headquarters === HeadquartersTypeEnum[2]
                && (name === 'vankeContract' || name === 'vankeLvYue') && show.checkerId === 'payType') {
                // 金地线上提单 展示金地本次付款性质提示
                show.memo = '金地原始数据款项类型：' + obj.feeTypeName;
            }
        });
        return shows;
    }

    /**
     * 根据万科接口数据列表中的“款项类型名称”取值匹配对应payType
     * @param ref
     */
    static getPayType(ref: string, feeTypeName: string) {
        const value = SelectOptions.getConfValue(ref, feeTypeName);
        return value ? value : (ref === 'payType' ? 3 : 5);
    }
}
