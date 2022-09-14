import { XnUtils } from '../common/xn-utils';
import { SelectOptions } from './select-options';

export class Tables {
    private static configs = {
        'flow-record': {
            url: '/record/record',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['recordId'],
            fields: [
                { label: '标题', name: 'title', render: Tables.recordTitleRender },
                { label: '流程名', name: 'flowName' },
                // {label: '记录ID', name: 'recordId'},
                // {label: '关联记录ID', name: 'relatedRecordId'},
                { label: '当前步骤', name: 'nowProcedureName' },
                { label: '状态', name: 'status', selectOptions: 'recordStatus' },
                { label: '创建时间', name: 'createTime', render: Tables.timeRender },
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        'flow-record-vanke': {
            url: '/record/record',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['recordId'],
            fields: [
                { label: '标题', name: 'title', render: Tables.recordTitleRender },
                { label: '流程名', name: 'flowName' },
                // {label: '记录ID', name: 'recordId'},
                // {label: '关联记录ID', name: 'relatedRecordId'},
                { label: '当前步骤', name: 'nowProcedureName' },
                { label: '状态', name: 'status', selectOptions: 'recordStatus' },
                { label: '登记编码', name: 'registrationCode', render: Tables.filterEmpty },
                { label: '修改码', name: 'modifiedCode', render: Tables.filterEmpty },
                { label: '创建时间', name: 'createTime', render: Tables.timeRender },
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        supplier: {
            url: '/custom/common/app_list/list',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '供应商ID', name: 'appId' },
                { label: '供应商名称', name: 'orgName' },
                { label: '拼音', name: 'orgNameSpelling' }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                { label: '声母', name: 'orgNameSyllable' }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.orgName,
                    value: data.appId
                };
            }
        },
        UpstreamCustomers: {
            url: '/list/company/upstream',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '上游客户ID', name: 'appId' },
                { label: '企业名称', name: 'orgName' },
                { label: '拼音', name: 'orgNameSpelling' }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                { label: '声母', name: 'orgNameSyllable' }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.orgName,
                    value: data.appId
                };
            }
        },
        factoring: {
            url: '/custom/common/app_list/list',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '保理商ID', name: 'appId' },
                { label: '保理商名称', name: 'orgName' },
                { label: '拼音', name: 'orgNameSpelling' }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                { label: '声母', name: 'orgNameSyllable' }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.orgName,
                    value: data.appId
                };
            }
        },
        core: {
            url: '/custom/common/app_list/list',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '核心企业ID', name: 'appId' },
                { label: '核心企业名称', name: 'orgName' },
                { label: '拼音', name: 'orgNameSpelling' }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                { label: '声母', name: 'orgNameSyllable' }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.orgName,
                    value: data.appId
                };
            }
        },
        core1: {
            url: '/relation/core1',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                // {label: '核心企业ID', name: 'enterpriseAppId'},
                { label: '核心企业名称', name: 'enterpriseName' },
                // {label: '拼音', name: 'orgNameSpelling'}, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                // {label: '声母', name: 'orgNameSyllable'}, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.enterpriseName,
                    value: data.enterpriseName
                };
            }
        },
        relation: {
            url: '/relation/app_relation',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['factoringAppId'],
            fields: [
                { label: '保理公司ID', name: 'factoringAppId' },
                { label: '保理公司名称', name: 'factoringOrgName' }
            ],
            formatLabelValue: (data) => {
                return {
                    label: `${data.factoringOrgName}`,
                    value: `${data.factoringAppId}`
                };
            }
        },
        todo: { // 首页代办
            url: '/user/todo',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['recordId'],
            fields: [
                { label: '流程名称', name: 'flowName' },
                // {label: '记录ID', name: 'recordId'},
                { label: '标题', name: 'title', render: Tables.recordTitleRender },
                { label: '当前步骤', name: 'nowProcedureName' },
                { label: '状态', name: 'status', selectOptions: 'recordStatus' },
                { label: '创建时间', name: 'createTime', render: Tables.timeRender },
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        bank: { // 选择托管银行
            url: '/llz/direct_payment/bank_list',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '银行ID', name: 'appId' },
                { label: '银行名称', name: 'orgName' },
                { label: '拼音', name: 'orgNameSpelling' }, // 拼音的label为'拼音'，在data-table-picker中用到，隐藏
                { label: '声母', name: 'orgNameSyllable' }, // 声母的label为'声母'，在data-table-picker中用到，隐藏
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.orgName,
                    value: data.appId
                };
            }
        },
        'list-related': {
            url: '/record/list_related',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['recordId'],
            fields: [
                { label: '记录ID', name: 'recordId' },
                { label: '标题', name: 'title', render: Tables.recordTitleRender },
                { label: '创建时间', name: 'createTime', render: Tables.timeRender },
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        'main-flow': {
            url: { get: '/flow/main/all' },
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['mainFlowId'],
            fields: [
                { label: '交易ID', name: 'mainFlowId' },
                { label: '供应商', name: 'supplierOrgName' },
                { label: '保理商', name: 'factoringOrgName' },
                { label: '状态', name: 'status', selectOptions: 'mainFlowStatus' },
                { label: '区块链订单ID', name: 'bcOrderId' },
                // {label: '创建时间', name: 'createTime', render: Tables.timeRender},
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        'doing-flow': {
            url: { get: '/flow/main/doing' },
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: ['mainFlowId'],
            fields: [
                { label: '交易ID', name: 'mainFlowId' },
                { label: '供应商', name: 'supplierOrgName' },
                { label: '保理商', name: 'factoringOrgName' },
                { label: '状态', name: 'status', selectOptions: 'mainFlowStatus' },
                { label: '区块链订单ID', name: 'bcOrderId' },
                // {label: '创建时间', name: 'createTime', render: Tables.timeRender},
                { label: '最后更新时间', name: 'updateTime', render: Tables.timeRender }
            ]
        },
        bankcard: {
            url: '/bank_card',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '银行账号', name: 'cardCode' },
                { label: '开户银行', name: 'bankName' },
                { label: '户名', name: 'accountHolder' },
                { label: '开户行行号', name: 'bankCode' }
            ],
            formatLabelValue: (data) => {
                return {
                    label: data.cardCode,
                    value: data.bankName
                };
            }
        },
        'money-order': {
            url: '/money_order',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '企业Id', name: 'appId' },
                { label: '出票人', name: 'appName', render: Tables.drawRender },
                { label: '承兑人', name: 'acceptorName' },
                { label: '商票号码', name: 'billNumber' },
                { label: '商票金额', name: 'billAmount' },
                { label: '是否可融资', name: 'isUseQuota', render: Tables.quataRender },
            ]
        },
        app: {
            url: '/app',
            allowCreate: false,
            allowUpdate: false,
            allowDelete: false,
            keys: [],
            fields: [
                { label: '企业Id', name: 'appId' },
                { label: '企业名称', name: 'appName', render: Tables.drawRender },
                { label: '法人姓名', name: 'orgLegalPerson' },
                { label: '注册状态', name: 'status', render: Tables.getStatus },
                { label: '创建时间', name: 'createTime', render: Tables.timeRender },
            ],
        },
        // formatLabelValue: (data) => {
        //     return {
        //         label: data.cardCode,
        //         value: data.bankName
        //     };
        // }
        // },
    };
    private static readonly flows = {
        // 数组内容 分别是 pageTitle, pageDesc, tableTitle, newBtnText
        // 如果newBtnText为''， 则表示该流程不能发起新流程
        create_auth: ['审核新机构的创建', '', '记录列表', ''],
        financing: ['基础模式', '', '记录列表', '发起交易申请'],
        financing_platform: ['平台处理申请资料', '', '记录列表', ''],
        financing_factoring: ['保理商审批并签署合同', '', '记录列表', ''],
        financing_supplier: ['申请企业确认并签署合同', '', '记录列表', ''],
        factoring_loan: ['保理商放款', '', '记录列表', '发起放款登记'],
        supplier_endorse: ['申请企业回款处理', '', '记录列表', '发起转让登记'],
        factoring_repayment: ['保理商收款登记', '', '记录列表', '发起收款登记'],
        enterprise_register: ['出票登记', '', '记录列表', '发起出票登记'],
        financing_report_upload: ['财报更新', '', '记录列表', '发起流程'],
        financing1: ['回购模式', '', '记录列表', '发起交易申请'],
        financing2: ['委托模式', '', '记录列表', '发起交易申请'],
        financing3: ['标准保理', '', '记录列表', '发起交易申请'],
        financing_pre4: ['传统模式', '', '记录列表', '发起交易申请'],
        financing_pre5: ['金地模式', '', '记录列表', '发起交易申请'],
        financing_jd5: ['金地模式', '', '记录列表', ''],
        financing_pre6: ['流程记录', '', '记录列表', '发起交易申请'],
        promise_discount: ['保理保证', '', '记录列表', '发起交易申请'],
        financing7: ['保理融资', '', '记录列表', '发起交易申请'],
        financing11: ['定向收款托管协议签约', '', '记录列表', '发起委托签约申请'],
        financing12: ['定向收款托管协议变更/终止', '', '记录列表', '发起变更协议申请'],
        financing_confirm_loan13: ['保理商确认回款', '', '记录列表', '发起确认回款申请'],
        financing_pre14: ['金地模式', '', '记录列表', '发起交易申请'],
        upload_base: ['上传基本资料', '', '记录列表', '发起上传申请'],
        credit_report_upload: ['征信报告更新', '', '记录列表', '发起流程'],
    };

    private static configsHandled = false;

    private static genRender(fieldName: string): any {

        // tslint:disable-next-line:only-arrow-functions
        return function(data, type, row) {

            if (type === 'display') {
                const arr = SelectOptions.get(fieldName);
                if (arr === undefined) { return data; }

                for (const value of arr) {
                    if (value.value === data.toString()) {
                        return value.label;
                    }
                }
            }
            return data;
        };
    }

    private static timeRender(data, type, row) {
        if (type === 'display') {
            return XnUtils.formatShortDatetime(data);
        }
        return data;
    }

    private static recordTitleRender(data, type, row) {
        if (type === 'display') {
            return `<a href='javascript:void(0)' class="editor_view">${data}</a>`;
        }
        return data;
    }

    private static quataRender(data, type, row) {
        if (type === 'display') {
            return data === 1 ? '可融资' : '不可融资';
        }
        return data;
    }

    private static drawRender(data, type, row) {
        if (type === 'display') {
            data ? data = data : data = row && row.drawerName || ''; // 最后的空是为了防止不存在该字段
        }
        return data;
    }

    private static getStatus(data, type, row) {
        let status = '';
        if (type === 'display') {
            switch (data) {
                case 0:
                    status = '无效';
                    break;
                case 1:
                    status = '申请';
                    break;
                case 2:
                    status = '审核通过';
                    break;
            }
        }
        return status;
    }

    private static filterEmpty(data, type, row) {
        if (data === undefined || data === '') {
            return '';
        } else {
            return data;
        }
    }

    static getConfig(confName: string): any {
        if (!Tables.configsHandled) {
            Tables.configsHandled = true;

            // 对有selectOptions的字段生成render函数
            Object.keys(Tables.configs).map(key => {
                for (const field of Tables.configs[key].fields) {
                    if (field.selectOptions) {
                        field.render = Tables.genRender(field.selectOptions);
                    }
                }
            });
        }

        return Tables.configs[confName];
    }

    static getFlowDesc(flowId: string): string[] {
        const ret = this.flows[flowId];
        if (!ret) {
            return ['流程记录', '', '记录列表', ''];
        } else {
            return ret;
        }
    }
}
