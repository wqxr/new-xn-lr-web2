
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：JdDataChangeList
 * @summary：金地数据对接情况配置列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying      金地数据对接       2020-12-07
 * **********************************************************************
 */


export default class JdDataChangeList {

    // 接口推送情况
    static interfacePush = {
        heads: [
            { label: '推送时间', value: 'updatetime', type: 'date' },
            { label: '接口名称', value: 'callType', type: 'callType' },
            { label: '推送内容', value: 'callStatus', type: 'callStatus' },
            { label: '描述信息', value: 'msg', type: 'msg' },
            { label: '接口结果', value: 'status', type: 'status' },
        ] as ListHeadsFieldOutputModel[],
    };

    // 数据变动情况
    static dataChangeList = {
        heads: [
            { label: '字段', value: 'field' },
            { label: '业务平台数据', value: 'currentField' },
        ] as ListHeadsFieldOutputModel[],
    };


    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        // 平台
        platmachineAccount: {
            title: '',
            tabList: [
                {
                    label: '接口推送情况',
                    value: 'A',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            headText: JdDataChangeList.interfacePush.heads,
                        },
                    ],
                    post_url: '/sub_system/vanke_system/get_vanke_call_record',
                    params: 1,
                },
                {
                    label: '数据变动情况',
                    value: 'B',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            headText: JdDataChangeList.dataChangeList.heads,
                        },
                    ],
                    post_url: '/sub_system/jd_system/get_jd_history',
                    params: 2,

                },
            ]
        } as TabConfigModel,
        // 平台审核经办、复核数据变动
        platVerify: {
            title: '',
            tabList: [
                {
                    label: '数据变动情况',
                    value: 'C',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            headText: JdDataChangeList.dataChangeList.heads,
                        },
                    ],
                    post_url: '/sub_system/jd_system/get_jd_history',
                    params: 1,

                },
            ]
        } as TabConfigModel,
    };


    /**
     * 组装数据
     * @param resData 接口返回数据
     * @param heads 动态表头
     */
    static reorganizeData(resData: { list: any[], count: number },
        heads: any): any[] {

        const returnList = [];
        allFiledArr.forEach((val, index, arr) => {
            if (resData.list) {

                const item = {
                    field: JdDataChangeList.getConfLabel(filedLabelArr, val),
                    currentField: '',
                    fieldName: val,   // 字段标识
                    isChanged: JdDataChangeList.filedChanged(resData, val, heads),   // 是否有变动，标红
                    fieldType: JdDataChangeList.jdugeFieldType(val)
                };
                // 业务平台数据
                if (!!resData.list[0][val] || String(resData.list[0][val]) === '0') {
                    item.currentField = resData.list[0][val];
                }
                // 变动数据-以时间为表头
                heads.forEach((t: any, i: number) => {
                    if (!!resData.list.slice(1)[i][val] || String(resData.list.slice(1)[i][val]) === '0') {
                        item[t.value] = resData.list.slice(1)[i][val];
                    }
                });
                returnList.push(item);
            }
        });
        return returnList;
    }

    /**
     * 根据name获取指定配置
     * @param name platmachineAccount、platVerify
     */
    static getConfig(name: string) {
        return this.config[name];
    }

    /**
     * 根据value获取对应label
     * @param filedLabelArr
     * @param value
     */
    static getConfLabel(filedLabelArr: any[], value: string): string {
        if (filedLabelArr.length) {
            for (const obj of filedLabelArr) {
                if (obj.value.toString() === value.toString()) {
                    return obj.label;
                }
            }
        }
        return '';
    }

    /**
     * 判断字段是否有变动
     * @param res 接口返回数据
     * @param val 字段名
     * @param heads 表头(动态生成的时间)
     */
    static filedChanged(res: any, val: string, heads: any): string[] {
        const changeArr = [];
        if (res.list && res.list.length >= 1) {
            res.list.forEach((v: any, i: number) => {
                const index = i;
                if (index < res.list.length - 1 && res.list[index][val] !== undefined) { // 当前业务数据未返回 则不进行比对
                    if (typeof (res.list[index][val]) === 'string') { // 字符串去空判断
                        res.list[index][val].trim()
                        // res.list[index + 1][val].trim()
                    }
                    if (res.list[index][val] !== res.list[index + 1][val]
                        && JSON.stringify(res.list[index][val]) !== JSON.stringify(res.list[index + 1][val])) {
                        // 有变动
                        if (index === 0) {
                            changeArr.push('currentField', heads[0].value);
                        } else {
                            changeArr.push(heads[index - 1].value, heads[index].value);
                        }
                    }
                }
            });
        }

        return [...changeArr];
    }

    /**
     * 判断字段类型
     */
    static jdugeFieldType(field: string): string {
        let type = 'text';
        if (moneyType.includes(field)) {
            type = 'money';
        } else if (invoiceListType.includes(field)) {
            type = 'invoice';
        } else if (dateType.includes(field)) {
            type = 'date';
        } else if (dateTimeType.includes(field)) {
            type = 'datetime';
        } else if (longdatetimeType.includes(field)) {
            type = 'longdatetime';
        } else if (selectType.includes(field)) {
            type = 'select';
        } else if (rateType.includes(field)) {
            type = 'rate';
        } else {
            type = 'text';
        }
        return type;
    }

}
export const moneyType = ['financingAmount', 'latestCost', 'adjustmentAmount',
    'settlementMoney', 'settmentAmount', 'invoicedAmount', 'paidAmount', 'paymentApplyAmount'];
export const invoiceListType = ['invoiceList',];
export const dateType = ['paymentApprovedDate', 'financeApplyDate'];
export const dateTimeType = ['signtime', 'settmentTime', 'returnTime'];
export const longdatetimeType = [];
export const selectType = ['syncReason', 'approveStatus', 'settmentStatus', 'returnType', 'returnReason'];
export const rateType = ['discountRate'];

export const allFiledArr = [
    'billNumber',  // 融资单号
    'financingAmount',  // 融资金额
    'syncReason',    // 同步原因 1=融资单由金地分配完渠道 2=审批完成
    'paymentApplyNumber',    // EAS付款单号
    'paymentApplyAmount',    // 付款申请单金额
    'approveStatus',  // 申请单审批状态 0=审批中 1=审批完成
    'paymentName',    // 款项名称
    'paymentType',    // 付款类型
    'paymentApprovedDate',    // 付款审批完成日期
    "projectCompanyName",    //项目公司名称
    "areaCode",    //地区代码
    "areaName",    //区域名称
    'city',    // 城市
    'projectName',    // 项目名称
    'invoiceList',    // 发票信息
    'financeApplyDate',    // 发起融资申请日期
    'payCompanyName',    // 付款单位名称
    'payCompanyCode',    // 付款单位编码
    'pcSocialCreditCode',    // 付款单位统一信用代码
    'pcTaxNumber',    // 付款单位税务登记证号
    'pcBusinessLicese',    // 付款单位营业执照号码
    'pcOrganizationCode',    // 付款单位组织机构代码
    'receiptCompanyName',    // 收款单位名称
    'receiptCompanyCode',    // 收款单位编码
    'rcSocialCreditCode',    // 收款单位统一信用代码
    'rcTaxNumber',    // 收款单位税务登记证号
    'rcBusinessLicese',    // 收款单位营业执照号码
    "rcOrganizationCode",    //收款单位组织机构代码
    'bankAccountName',    // 收款人名称
    'bankName',  // 收款人开户银行
    'bankAccountNumber',  // 收款人银行账号
    'supplierContact', // 供应商联系人名称
    'supplierContactNumber', // 供应商联系电话
    'areaContact', // 区域联系人
    'areaContactNumber', // 区域联系电话
    'projectContact', // 项目联系人名称
    'projectContactNumber', // 项目联系电话
    'constructionProject', // 工程项目
    'contractCode', // 合同编号
    'contractName', // 合同名称
    'contractType', // 合同类别
    'latestCost', // 合同金额
    'adjustmentAmount', // 补充协议调整金额
    'contractSigner', // 供应商名称
    'advanceChargePercent', // 预付款支付比例
    'progressPaymentPercent', // 进度款支付比例
    'settlementPercent', // 结算款支付比例
    'invoicedType', // 发票类型
    'taxpayerType', // 纳税人身份
    'settlementMoney', // 结算金额
    'contractActualcode', // 合同归档编号
    'contractStatus', // 合同状态
    'signtime', // 合同签署时间
    'settmentAmount', // 已确认的产值金额
    'invoicedAmount', // 合同已开票金额
    'paidAmount', // 合同已付款金额
    'settmentStatus',   // 是否已结算 0=未结算 1=已结算
    'settmentTime',  // 结算时间
    'projectCode',  // 项目编号
    'projectStage', // 分期名称
    'useEsFlag', // 合同是否使用电子签章
    'returnTime', // 退单时间
    'returnType', // 退回类型 1=退单 2=修改金额 3=更换渠道'
    'returnReason', // 退回原因 1=资金方要求 2=金地要求 3=供应商要求'
    'remark', // 退回备注
];
export const filedLabelArr = [
    { label: '融资单号', value: 'billNumber' },  // 融资单号
    { label: '融资金额', value: 'financingAmount' },  // 融资金额
    { label: '同步原因', value: 'syncReason', },  // 同步原因 1=融资单由金地分配完渠道 2=审批完成
    { label: 'EAS付款单号', value: 'paymentApplyNumber' },    // EAS付款单号
    { label: '付款申请单金额', value: 'paymentApplyAmount' },   // 付款申请单金额
    { label: '申请单审批状态', value: 'approveStatus' },  // 申请单审批状态 0=审批中 1=审批完成
    { label: '款项名称', value: 'paymentName' },   // 款项名称
    { label: '付款类型', value: 'paymentType' },   // 付款类型
    { label: '付款审批完成日期', value: 'paymentApprovedDate' },    // 付款审批完成日期
    { label: "项目公司名称", value: 'projectCompanyName' },    //项目公司名称
    { label: "地区代码", value: 'areaCode' },   //地区代码
    { label: "区域名称", value: 'areaName' },   //区域名称
    { label: '城市', value: 'city' },   // 城市
    { label: '项目名称', value: 'projectName' },    // 项目名称
    { label: '发票信息', value: 'invoiceList' },   // 发票信息
    { label: '发起融资申请日期', value: 'financeApplyDate' },    // 发起融资申请日期
    { label: '付款单位名称', value: 'payCompanyName' },    // 付款单位名称
    { label: '付款单位编码', value: 'payCompanyCode' },    // 付款单位编码
    { label: '付款单位统一信用代码', value: 'pcSocialCreditCode' },    // 付款单位统一信用代码
    { label: '付款单位税务登记证号', value: 'pcTaxNumber' },    // 付款单位税务登记证号
    { label: '付款单位营业执照号码', value: 'pcBusinessLicese' },    // 付款单位营业执照号码
    { label: '付款单位组织机构代码', value: 'pcOrganizationCode' },    // 付款单位组织机构代码
    { label: '收款单位名称', value: 'receiptCompanyName' },    // 收款单位名称
    { label: '收款单位编码', value: 'receiptCompanyCode' },    // 收款单位编码
    { label: '收款单位统一信用代码', value: 'rcSocialCreditCode' },    // 收款单位统一信用代码
    { label: '收款单位税务登记证号', value: 'rcTaxNumber' },    // 收款单位税务登记证号
    { label: '收款单位营业执照号码', value: 'rcBusinessLicese' },    // 收款单位营业执照号码
    { label: "收款单位组织机构代码", value: 'rcOrganizationCode' },    //收款单位组织机构代码
    { label: '收款人名称', value: 'bankAccountName' },    // 收款人名称
    { label: '收款人开户银行', value: 'bankName' },  // 收款人开户银行
    { label: '收款人银行账号', value: 'bankAccountNumber' },  // 收款人银行账号
    { label: '供应商联系人名称', value: 'supplierContact' }, // 供应商联系人名称
    { label: '供应商联系电话', value: 'supplierContactNumber' }, // 供应商联系电话
    { label: '区域联系人', value: 'areaContact' }, // 区域联系人
    { label: '区域联系电话', value: 'areaContactNumber' }, // 区域联系电话
    { label: '项目联系人名称', value: 'projectContact' }, // 项目联系人名称
    { label: '项目联系电话', value: 'projectContactNumber' }, // 项目联系电话
    { label: '工程项目', value: 'constructionProject' }, // 工程项目
    { label: '合同编号', value: 'contractCode' }, // 合同编号
    { label: '合同名称', value: 'contractName' }, // 合同名称
    { label: '合同类别', value: 'contractType' }, // 合同类别
    { label: '合同金额', value: 'latestCost' }, // 合同金额
    { label: '补充协议调整金额', value: 'adjustmentAmount' }, // 补充协议调整金额
    { label: '供应商名称', value: 'contractSigner' }, // 供应商名称
    { label: '预付款支付比例', value: 'advanceChargePercent' }, // 预付款支付比例
    { label: '进度款支付比例', value: 'progressPaymentPercent' }, // 进度款支付比例
    { label: '结算款支付比例', value: 'settlementPercent' },// 结算款支付比例
    { label: '发票类型', value: 'invoicedType' },// 发票类型
    { label: '纳税人身份', value: 'taxpayerType' }, // 纳税人身份
    { label: '结算金额', value: 'settlementMoney' }, // 结算金额
    { label: '合同归档编号', value: 'contractActualcode' },// 合同归档编号
    { label: '合同状态', value: 'contractStatus' }, // 合同状态
    { label: '合同签署时间', value: 'signtime' },// 合同签署时间
    { label: '已确认的产值金额', value: 'settmentAmount' }, // 已确认的产值金额
    { label: '合同已开票金额', value: 'invoicedAmount' }, // 合同已开票金额
    { label: '合同已付款金额', value: 'paidAmount' }, // 合同已付款金额
    { label: '是否已结算', value: 'settmentStatus' },  // 是否已结算 0=未结算 1=已结算
    { label: '结算时间', value: 'settmentTime' },  // 结算时间
    { label: '项目编号', value: 'projectCode' }, // 项目编号
    { label: '分期名称', value: 'projectStage' },// 分期名称
    { label: '合同是否使用电子签章', value: 'useEsFlag' },// 合同是否使用电子签章
    { label: '退单时间', value: 'returnTime' },// 退单时间
    { label: '退回类型', value: 'returnType' },// 退回类型
    { label: '退回原因', value: 'returnReason' },// 退回原因
    { label: '退回备注', value: 'remark' },// 退回备注
];
