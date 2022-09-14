// 交易模式
export enum TradingModeEnum {
    '万科模式' = 1,
    '两票一合同' = 2,
}


// 财务表单
export enum FinanceEnum {
    'balance' = '资产负债表',
    'profit' = '利润表',
    'cash' = '现金流量表',
}

// 客户调查
export enum CustomerEnum {
    'info' = '客户调查',
    'financial' = '财务数据',
    'core' = '核心指标',
    'credit' = '征信调查',
    'opponent' = '交易对手',
    'grade' = '信用评级',
}

// 法人机构
export enum LegalEnum {
    'referee' = '裁判文书',
    'courtNotice' = '法院公告',
    'opening' = '开庭公告',
}

// 关联企业
export enum OpponentEnum {
    'add' = '新增',
    'edit' = '编辑',
}

// 催收提示
export enum CollectionEnum {
    'vanke' = '标准保理（万科模式）',
    'jinde' = '标准保理（金地模式）',
    'base' = '两票一合同模式',
    'direcpay' = '定向支付模式',
}

// 融资详情
export enum FinancingDetailEnum {
    'flow' = '流程记录',
    'tradeMap' = '贸易动图',
    'digitalAssets' = '数字资产记录',
    'security' = '保全机制',
    // 'grade' = '信用评级',
}

// 企业类型
export enum OrgNametypeEnum {
    'core' = '核心企业',
    'supplier' = '供应商',
}
