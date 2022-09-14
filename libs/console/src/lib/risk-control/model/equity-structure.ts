// 股权结构图
export class EquityStructureOutputModel {
    Name?: string; // 公司名称或者人名
    KeyNo?: string; // 当前股东的公司keyNo
    Category?: string; // 1 是公司，2是个人
    StockType?: string; // 股东类型
    Count?: number; // 对应的children count
    SubConAmt?: string; // 出资金额
    FundedRatio?: string; // 出资比例
    IsAbsoluteController?: string; // 是否绝对控股
    Grade?: string; // 对应的层级
    OperName?: string; // 法人代表
    InParentActualRadio?: string; // 当前股东所在公司在该公司父级中所占实际比例
    ParentKeyNo?: string; // 母公司keyNo
    awesome?: string; // 符号
    expand?: boolean; // 是否展开
    Children?: EquityStructureOutputModel[];
}
