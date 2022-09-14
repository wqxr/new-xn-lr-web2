// 公司信息输出字段
export class CustomerInfoOutputModel {
    KeyNo = ''; // 内部KeyNo
    Name = ''; // 公司名称
    No = ''; // 注册号
    BelongOrg = ''; // 登记机关
    OperName = ''; // 法人名
    StartDate = ''; // 成立日期
    EndDate = ''; // 吊销日期
    Status = ''; // 企业状态
    Province = ''; // 省份
    UpdatedDate = ''; // 更新日期
    CreditCode = ''; // 社会统一信用代码
    RegistCapi = ''; // 注册资本
    RelRegistCapi = ''; // 实际缴纳资本
    EconKind = ''; // 企业类型
    Address = ''; // 地址
    Scope = ''; // 经营范围
    TermStart = ''; // 营业开始日期
    TeamEnd = ''; // 营业结束日期
    CheckDate = ''; // 发照日期
    OrgNo = ''; // 组织机构代码
    IsOnStock = ''; // 是否上市(0为未上市，1为上市)
    StockNumber = ''; // 上市公司代码
    StockType = ''; // 上市类型
    ImageUrl = ''; // 企业Logo
    industry = ''; // 所属行业
    area = ''; // 所属地区
    enName = ''; // 英文名
    onceName = ''; // 曾用名
    bussinessModes = ''; // 经营方式
    staffSize = ''; // 人员规模
    bussinessTerm = ''; // 营业期限
    checkDate = ''; // 核准日期
    Industry?: IndustryOutputModel; // 行业信息
    ChangeRecords?: ChangeRecordsOutputModel[];
    Branches?: BranchesOutputModel[];
    Employees?: EmployeesOutputModel[];
    Partners?: PartnersOutputModel[];
    OriginalName?: OriginalNameOutputModel[];
}

// 公司概况
export class ChangeRecordsOutputModel {
    ProjectName = ''; // 变更事项
    BeforeContent = ''; // 变更前内容
    AfterContent = ''; // 变更后内容
    ChangeDate = ''; // 变更日期
}

// 分支机构信息
export class BranchesOutputModel {
    CompanyId = ''; // CompanyId
    RegNo = ''; // 注册号
    Name = ''; // 名称
    BelongOrg = ''; // 登记机关
    CreditCode = ''; // 社会统一信用代码
    OperName;
}

// 主要成員信息
export class EmployeesOutputModel {
    Name = ''; // 姓名
    Job = ''; // 职位
}

// 股东信息
export class PartnersOutputModel {
    StockName = ''; // 股东
    StockType = ''; // 股东类型
    StockPercent = ''; // 出资比例
    ShouldCapi = ''; // 认缴出资额
    ShoudDate = ''; // 认缴出资时间
    InvestType = ''; // 认缴出资方式
    InvestName = ''; // 实际出资方式
    RealCapi = ''; // 实缴出资额
    CapiDate = ''; // 实缴时间
}

// 行业信息
export class IndustryOutputModel {
    StockName = ''; // 股东
    StockType = ''; // 股东类型
    StockPercent = ''; // 出资比例
    ShouldCapi = ''; // 认缴出资额
    ShoudDate = ''; // 认缴出资时间
    InvestType = ''; // 认缴出资方式
    InvestName = ''; // 实际出资方式
    RealCapi = ''; // 实缴出资额
    CapiDate = ''; // 实缴时间
}

// 曾用名
export class OriginalNameOutputModel {
    Name = ''; // 曾用名
    ChangeDate = ''; // 变更日期
}

// 核心指标
export class CoreReferenceOutputModel {
    appId = ''; // '机构ID',
    orgName = ''; // '机构名称，必须是全称',
    stockHolderBackground = ''; // '股东背景',
    leadershipQuality = ''; // '领导者素质',
    seniorManagementQuality = ''; // '高级经营管理人员素质',
    employeeQuality = ''; // '从业人员素质',
    corporateGovernanceStructure = ''; // '企业法人治理结构',
    businessObjectives = ''; // '经营目标与目标管理',
    internalControlSystem = ''; // '内部控制制度建设与实施',
    salesManagement = ''; // '营销管理',
    financingManagement = ''; // '融资管理',
    investmentManagement = ''; // '投资管理',
    financeManagement = ''; // '财务管理',
    corporateCreditRecord = ''; // '企业信用记录',
    brandStrategy = ''; // '品牌战略',
    marketPosition = ''; // '市场地位和份额',
    technologyResearch = ''; // '技术研发',
    customersProducts = ''; // '客户和产品的多样性',
    assetYearEndLoansRatio = ''; // '净资产与年末贷款余额比率',
    assetLiabilityRatio = ''; // '资产负债率',
    assetFixedRatio = ''; // '资产固定比率',
    liquidityRatio = ''; // '流动比率',
    quickRatio = ''; // '速动比率',
    cashNoLiquidityRatio = ''; // '非筹资性现金净流入与流动负债比率',
    cashYesLiquidityRatio = ''; // '经营性现金净流入与流动负债比率',
    timesInterestEarned = ''; // '利息保障倍数',
    collateralRatio = ''; // '担保比率',
    incomeCashRatio = ''; // '营业收入现金率',
    receivablesTurnoverRatio = ''; // '应收账款周转速度',
    inventoryTurnoverRatio = ''; // '存货周转速度',
    grossProfitRatio = ''; // '毛利率',
    operatingProfitRatio = ''; // '营业利润率',
    assetIncomeRatio = ''; // '净资产收益率',
    assetTotalRatio = ''; // '总资产报酬率',
    industryRelatedPolicies = ''; // '产业及相关宏观经济政策',
    economicEnvironment = ''; // '经济环境',
    lawEnvironment = ''; // '法律环境',
    industryEnvironment = ''; // '行业环境',
    industryCharacteristics = ''; // '行业特性',
    developmentProspect = ''; // '发展前景',
    antiRiskCapability = ''; // '抗风险能力',
    growth = ''; // '成长性',
    stockHolderBackgroundScore = ''; // '股东背景分值',
    leadershipQualityScore = ''; // '领导者素质分值',
    seniorManagementQualityScore = ''; // '高级经营管理人员素质分值',
    employeeQualityScore = ''; // '从业人员素质分值',
    corporateGovernanceStructureScore = ''; // '企业法人治理结构分值',
    businessObjectivesScore = ''; // '经营目标与目标管理分值',
    internalControlSystemScore = ''; // '内部控制制度建设与实施分值',
    salesManagementScore = ''; // '营销管理分值',
    financingManagementScore = ''; // '融资管理分值',
    investmentManagementScore = ''; // '投资管理分值',
    financeManagementScore = ''; // '财务管理分值',
    corporateCreditRecordScore = ''; // '企业信用记录分值',
    brandStrategyScore = ''; // '品牌战略分值',
    marketPositionScore = ''; // '市场地位和份额分值',
    technologyResearchScore = ''; // '技术研发分值',
    customersProductsScore = ''; // '客户和产品的多样性分值',
    assetYearEndLoansRatioScore = ''; // '净资产与年末贷款余额比率分值',
    assetLiabilityRatioScore = ''; // '资产负债率分值',
    assetFixedRatioScore = ''; // '资产固定比率分值',
    liquidityRatioScore = ''; // '流动比率分值',
    quickRatioScore = ''; // '速动比率分值',
    cashNoLiquidityRatioScore = ''; // '非筹资性现金净流入与流动负债比率分值',
    cashYesLiquidityRatioScore = ''; // '经营性现金净流入与流动负债比率分值',
    timesInterestEarnedScore = ''; // '利息保障倍数分值',
    collateralRatioScore = ''; // '担保比率分值',
    incomeCashRatioScore = ''; // '营业收入现金率分值',
    receivablesTurnoverRatioScore = ''; // '应收账款周转速度分值',
    inventoryTurnoverRatioScore = ''; // '存货周转速度分值',
    grossProfitRatioScore = ''; // '毛利率分值',
    operatingProfitRatioScore = ''; // '营业利润率分值',
    assetIncomeRatioScore = ''; // '净资产收益率分值',
    assetTotalRatioScore = ''; // '总资产报酬率分值',
    industryRelatedPoliciesScore = ''; // '产业及相关宏观经济政策分值',
    economicEnvironmentScore = ''; // '经济环境分值',
    lawEnvironmentScore = ''; // '法律环境分值',
    industryEnvironmentScore = ''; // '行业环境分值',
    industryCharacteristicsScore = ''; // '行业特性分值',
    developmentProspectScore = ''; // '发展前景分值',
    antiRiskCapabilityScore = ''; // '抗风险能力分值',
    growthScore = ''; // '成长性分值',
}
