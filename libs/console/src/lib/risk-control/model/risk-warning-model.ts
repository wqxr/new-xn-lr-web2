// 标签页
export class LabelPageModel {
    public label: string;
    public value: any;
}

// 催收提示
export class CollectionReminderModel {
    public mainFlowId?: string; // 交易ID
    public supplierOrgName?: string; // 供应商
    public enterpriseOrgName?: string; // 核心企业
    public contractAmount?: any; // 保理金额
    public price?: string; // 利率
    public isProxy?: string; // 交易模式
    public factoringDueTime?: string; // 保理到期日
    public operator?: string; // 管户人
    public invoives?: number; // 发票数量
    public invoivesAmounts?: number; // 发票金额
    public invoiceAbnormal?: string; // 发票异常情况
    public due01?: string; // 期前五日 资金到位比例
    public due02?: string; // 期前三日 资金到位比例
    public due03?: string; // 到期日 资金到位比例
    public due04?: string; // 当前 资金到位比例
}

export class ReminderOutputModel {
    vanke: CollectionReminderModel[] = [];  // 万科模式
    base: CollectionReminderModel[] = [];  // 基础模式
    jinde: CollectionReminderModel[] = []; // 金地模式
    direcpay: CollectionReminderModel[] = []; // 定向收款
}


// 商票字段数据
export class TicketInfoModel {
    billNumber: string;    // 商票号码
    billAmount: any;       // 商票金额
    issueDate: string;     // 开票日期
    drawerName: string;            // 开票人
    acceptorName: string;       // 承兑人
    payeeName: string;              // 持票人
    dueDate: string;        // 商票到期日
    status: any;          // 是否质押
    isUseQuota: any;       // 是否保理
}

// 商票字段数据
export class InvoiceInfoModel {
    mainFlowId: string;     // 交易ID
    supplierOrgName: string; // 供应商
    enterpriseOrgName: string;  // 核心企业
    contractAmount: string;  // 保理金额
    price: string;   // 利率
    isProxy: string;   // 交易模式
    invoiceNumber: any;   // 发票数量
    invoiceAmount: string;    // 发票金额
    invoiceStatus: string; // 发票异常情况
    operator: string;    // 管护人
}
