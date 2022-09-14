/**
 * 合同生成类型
 * - 类型值大于1000的是要签属合同的
 * - 类型值小于1000的是不需要签属合同的
 */
export enum ContractCreateType {
    /** 《总部公司回执（二次转让）》 */
    CodeReceipt2 = 1,
    /** 《项目公司回执（二次转让）》 */
    CodeProjectReceipt2 = 2,
    /** 项目公司回执（一次转让）》 */
    CodeProjectReceipt1 = 3,
    /** 《付款确认书（总部致券商）》 */
    CodeBrokerPayConfirm = 4,
    /** 《付款确认书（总部致保理商）》 */
    CodeFactoringPayConfirm = 5,
    /** 《致总部公司通知书（二次转让）》 */
    CodeNotice2 = 1001,
    /** 《致项目公司通知书（二次转让）》 */
    CodeProjectNotice2 = 1002,
    /** 《债权转让及账户变更通知的补充说明 */
    CodeChangeNoticeAdd = 1003,
}

/**
 * 龙光-二次转让合同生成类型
 * - 类型值大于1000的是要签属合同的
 * - 类型值小于1000的是不需要签属合同的
 */
export enum DragonContractCreateType {
    /** 总部回执（二次转让）-龙光 */
    second_lg_09 = 1,
    /** 项目公司回执（二次转让）-龙光 */
    second_lg_07 = 2,
    /** 项目公司回执（一次转让）-龙光 */
    second_lg_05 = 3,
    /** 付款确认书（总部致券商）-龙光 */
    second_lg_11 = 4,
    /** 付款确认书（总部致保理商）-龙光 */
    second_lg_10 = 5,

    /** 致总部通知书（二次转让）-龙光 */
    second_lg_08 = 1001,
    /** 致项目公司通知书（二次转让）-龙光 */
    second_lg_06 = 1002,
    /** 债权转让及账户变更通知的补充说明-龙光 */
    second_lg_add_03 = 1003,
    /** 应收账款转让通知书回执-龙光 */
    second_lg_12 = 101,
    /** 付款确认书（龙光总部向保理商出具）-龙光 */
    second_lg_13 = 106,
}

/** 范围 */
export enum SelectRange {
    /** 当前条件筛选下所有交易 */
    All = 1,
    /** 当前勾选的交易 */
    Select = 2,
    /** 仅抽样业务 */
    Sample = 3,
}
/**导出清单内容 */
export enum SelectContent {
    /**默认 */
    Default = 1,
    /** 应收账款数据录入表 */
    ReceiveTable = 2,
}

/** 下载附件方式 */
export enum DownloadType {
    /** 分不同文件夹 */
    DifferentFolder = 1,
    /** 放在同一文件夹 */
    SameFolder = 2
}

/** 新旧资产池 新-项目管理模块 旧-地产abs下资产池 */
export enum CapitalType {
    /** 新-项目管理模块 */
    New = 1,
    /** 旧-地产abs下资产池 */
    Old = 2
}

export enum DragonContentType {
    /** 《致总部公司通知书（二次转让）》 */
    CodeNotice2 = 1,
    /** 《总部公司回执（二次转让）》 */
    CodeReceipt2 = 2,
    /** 《致项目公司通知书（二次转让）》 */
    CodeProjectNotice2 = 3,
    /** 《项目公司回执（二次转让）》 */
    CodeProjectReceipt2 = 4,
    /** 项目公司回执（一次转让）》 */
    CodeProjectReceipt1 = 5,
    /** 《付款确认书（总部致券商）》 */
    CodeBrokerPayConfirm = 6,
    /** 《付款确认书（总部致保理商）》 */
    CodeFactoringPayConfirm = 7,
    /** 一次转让签署的合同文件 */
    CodeAssignment = 8,
    /** 中登登记证明文件 */
    CodeCertificate = 9,
    /** 查询证明文件 */
    CodeSearcherCertificate = 10,
    /** 基础资料 */
    CodeBaseResource = 11,
    /**<<债权转让及账户变更通知的补充说明>> */
    CodeCreditAccountChange = 12,
    /**<<放款回单>> */
    LoanReceipt = 13,
}
