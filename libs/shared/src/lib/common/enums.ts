/**
 * 业务模式
 */
export enum BusinessMode {
    /** 万科 */
    Vanke = 4,
    /** 金地 */
    Jindi = 5,
    /** 龙光 */
    Lg = 6,
    /** 雅居乐 */
    Yjl = 7,
}

/**
 *  企业类型枚举
 */
export enum EnterpriseMenuEnum {
    SUPPLIER = 1, // 供应商
    CORE = 2, // 核心企业
    FACTORING = 3, // 保理商
    BANK = 4, // 银行
    PLATFORM = 99, // 平台
    COREDOWNBUYER = 5, // 核心企业——下游采购商
    WINDCONTROL = 88, // 风控
    ABS = 77, // abs 资产管理
    BANKOLDHW = 66, // 银行角色——旧版hw
    // GEMDALEINTERMEDIARY = 102 // 金地模式-中介机构
    INTERMEDIARY = 102, // 中介机构-- 金地模式、新万科
}

/**
 * 保理商
 */
export enum FactoringEnum {
    NewAgile = '深圳市星顺商业保理有限公司',
}
