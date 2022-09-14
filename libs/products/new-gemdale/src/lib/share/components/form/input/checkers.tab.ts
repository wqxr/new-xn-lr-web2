export default class NewGemdaleInfos {

    static rejectListJd: TableStyle = {  // 金地数据对接-发起审核失败-所选交易
        heads: [
            { label: '融资单编号', value: 'billNumber', type: 'text' },
            { label: '收款单位', value: 'receiptCompanyName' },
            { label: '申请付款单位', value: 'projectCompanyName' },
            { label: '应收账款金额', value: 'financingAmount', type: 'money' },
            { label: '项目名称', value: 'projectName' },
        ] as HeadsStyle[],
        canChecked: false,
        rowButtons: [] as HeadsStyle[],
    };
    static confirmReceiveList: TableStyle = {  // 金地数据对接-项目公司确认应收账款金额-所选交易
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同编号', value: 'contractId' },
            { label: '提单发票号码', value: 'preInvoiceNum', },
            { label: '实际上传发票号码', value: 'invoiceNum', },
            { label: '提单发票总金额', value: 'preInvoiceAmount', type: 'money' },
            { label: '实际上传交易发票总金额', value: 'invoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receive', type: 'money' },
            { label: '应收账款到期日', value: 'factoringEndDate', type: 'date' },
            { label: '债权单位名称', value: 'debtUnit' },
            { label: '债权单位联系人', value: 'linkMan' },
            { label: '债权单位联系人手机号', value: 'linkPhone' },
            { label: '债权单位银行账户', value: 'debtUnitAccount' },
            { label: '债权单位银行开户行', value: 'debtUnitBank' },
            { label: '债务单位名称', value: 'projectCompany' },
            { label: '渠道', value: 'productType', type: 'productType' }
        ] as HeadsStyle[],
        canChecked: false,
        rowButtons: [] as HeadsStyle[],
    };

}
export interface TableStyle {
    heads: HeadsStyle[];
    canChecked: boolean;
    rowButtons: HeadsStyle[];
}
export interface HeadsStyle {
    label: string;
    value: string;
    type: string;
}
