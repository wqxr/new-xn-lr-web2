export class AmountControlOutputModel {
    core: EnterpriseListOutputModel[] = []; // 核心企业
    supplier: EnterpriseListOutputModel[] = []; // 供应商
}

export class EnterpriseListOutputModel {
    enterpriseName?: string; // 深圳市天农科技有限公司; // 核心企业
    momName?: string; // 母公司
    amount?: number; // 授信额度
    usedAmount?: number; // 已用额度 放款额度+预扣额度-回款额度
    leftAmount?: number; // 剩余额度
    validityDate?: string; // 有效日期
    transactionCycles?: string; // 交易周期
    averageDay?: string; // 历史交易周期
    averageAmount?: string; // 历史交易平均值
    supplierName?: string; // 供应商
}

export class EnterpriseTransferInput {
    pageSize?: number;
    total?: number;
    pageTitle?: string;
}
