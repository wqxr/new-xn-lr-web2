/**
 * dragon-custom-list组件配置
 */

export default class DragonCustomListConfig {
     // 项目管理-导出清单内容配置
    static exportList = {
        heads: [{ label: '字段名', value: 'field'}],
        data: [
            { label: '交易ID', value: 'mainFlowId'},
            { label: '收款单位', value: 'debtUnit'},
            { label: '申请付款单位', value: 'projectCompany'},
            { label: '总部公司', value: 'headquarters'},
            { label: '付款确认书编号', value: 'payConfirmId'},
            { label: '资产编号', value: 'tradeCode'},
            { label: '应收账款金额', value: 'receive'},
            { label: '资产转让折扣率', value: 'discountRate'},
            { label: '交易状态', value: 'tradeStatus'},
            { label: '交易模式', value: 'isProxy'},
            { label: '合同签署日期', value: 'signTime'},
            { label: '创建时间', value: 'createTime'},
            { label: '放款时间', value: 'loanDate'},
            { label: '收款单位账号', value: 'payeeAccountName'},
            { label: '收款单位开户行', value: 'payeeBankName'},
            { label: '联行号', value: 'bankCode'},
            { label: '基础交易合同编号', value: 'contractId'},
            { label: '基础交易合同名称', value: 'contractName'},
            { label: '发票编号', value: 'invoiceNum'},
            { label: '发票金额', value: 'invoiceAmount'},
            { label: '发票金额合计', value: 'sumInvoiceAmount'},
            { label: '供应商注册资料提交（是/否）', value: 'supplierSubmit'},
            { label: '项目公司注册资料提交（是/否）', value: 'projectCompanySubmit'},
            { label: '供应商注册成功（是/否）', value: 'supplierRegister'},
            { label: '项目公司注册成功（是/否）', value: 'projectCompanyRegister'},
            { label: '项目公司确认函上传（是/否）', value: 'projectCompanyUploadConfirm'},
            { label: '项目公司上传履约证明（是/否）', value: 'projectCompanyUploadPerformance'},
            { label: '项目公司一次转让回执上传（是/否）', value: 'projectCompanyOnetransferReceipt'},
            { label: '项目公司二次转让回执上传（是/否）', value: 'projectCompanyTwotransferReceipt'},
            { label: '保理融资到期日', value: 'factoringEndDate'},
            // { label: '资产池中合同列表的合同编号', value: 'capitalContractId'},  //此处待定，动态设置
            { label: '合同类型', value: 'contractType'},
            { label: '申请付款单位省份', value: 'supplierProvince'},
            { label: '收款单位省份', value: 'projectProvince'},
            { label: '律所尽调状态', value: 'lawFirmSurveyStatus'},
            { label: '律所尽调意见', value: 'lawFirmSurveyInfo'},
            { label: '管理人尽调状态', value: 'managerSurveyStatus'},
            { label: '管理人尽调意见', value: 'managerSurveyInfo'},
            { label: '付款确认书确认金额（元）', value: 'payConfirmAmount'},
            { label: '付款确认书确认金额（万元）（保留两位小数）', value: 'payConfirmAmountUnit'},
            { label: '单笔付款确认书金额占比（%，保留两位小数）', value: 'payConfirmAmountRatio'},
            { label: '转让价款', value: 'changePrice'},
            { label: '核心企业内部区域', value: 'area'},
            { label: '申请付款单位行业', value: 'projectCompanyIndustry'},
            { label: '上传发票与预录入是否一致', value: 'isInvoiceFlag'},
        ]
    };

}
