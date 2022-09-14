/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\enum\common-enum.ts
 * @summary：全局定义的一些常量枚举
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init          2021-07-07
 ***************************************************************************/

/** 系统消息阅读状态 */
export enum MsgStatus {
  /** 未读 */
  UNREAD = 0,
  /** 已读 */
  READED = 1,
  /** 删除 */
  DELETE = 2,
}

/** 业务模式 50及以下为老业务 */
export enum IsProxyDef {
  /** 不确定的类型 */
  UNKNOM = -1,
  /** 基础模式 */
  BASE = 0,
  /** 回购 */
  REPO = 1,
  /** 委托 */
  INTRUST = 2,
  /** 万科 */
  VANKE = 6,
  /** 定向 */
  DIRECTION = 13,
  /** 金地 */
  JINDI = 14,
  /** 星顺雅居乐 */
  XINSHUN_YJL = 18,
  /** 采购融资 */
  AVENGER = 50,
  /** 协议 */
  XIEYI = 51,
  /** 龙光 */
  DRAGON = 52,
  /** 新万科 2020 */
  VANKE_ABS = 53,
  /** 碧桂园 */
  BGY = 54,
  /** 华侨城 */
  OCT = 55,
  /** 新金地 */
  JD_ABS = 56,
  /** 雅居乐(恒泽) */
  YJL_ABS = 57,
  /** 成都轨交 */
  CDR = 58,
  /** 上海银行业务 */
  SH_BANK = 60,
  /** 华侨城-上海银行业务 */
  OCT_SH = 61,
}

/** 机构类型 */
export enum OrgType {
  /** 债权人、供应商 */
  Supplier = 1,
  /** 债务人、核心企业 */
  Enterprise = 2,
  /** 保理商、保理公司 */
  Factoring = 3,
  /** 银行、金融机构 */
  Bank = 4,
  /** 下游采购商 */
  Buyer = 5,
  /** 平台 */
  Platform = 99,
}
/**
 *
 * case 0:
                orgType = '其他';
                break;
            case 1:
                orgType = '商业承兑汇票';
                break;
            case 2:
                orgType = '银行承兑汇票';
                break;
            case 3:
                orgType = '转账';
                break;
            case 4:
                orgType = '信用证';
                break;
            case 5:
                orgType = '现金';
                break;
 */

/** 表单状态，表示当前表单是处于新增逻辑，还是编辑逻辑 */
export enum FormStatus {
  /** 新增 */
  Add = 'add',
  /** 编辑 */
  Edit = 'edit',
}

/** 与权限系统对接的状态 */
export enum RightStatus {
  /** 已注册已同步 */
  Down = 1,
  /** 未注册 */
  NotReg = 2,
  /** 未同步 */
  NotSync = 3,
}

/** 审批放款出纳下载模板的类型 */
export enum IsCashierType {
  /** 工行模板 */
  ICBC = '1',
  /** 潍坊模板 */
  Wei_fang = '2',
  /** 浦发模板 */
  Pu_fa = '3',
}

/** 流程记录操作 */
export enum OperateType {
  /** 未通过或草稿 */
  NONE = 0,
  /** 通过  */
  PASS = 1,
  /** 拒绝  */
  REJECT = 2,
  /** 中止  */
  SUSPENSION = 3,
}
export enum EditButtonType {
  /** 未通过或草稿 */
  NONE = '',
  /** 暂存/保存/补充信息  */
  SAVE = 'save',
  /** 拒绝  */
  REJECT = 'reject',
  /** 中止  */
  SUSPENSION = 'suspension',
  /** 资料补正 */
  COREECT_REJECT = 'correct-reject',
  /** 万科修改 */
  VANKE_CHANGE = 'vanke-change',
  /** 审核标准 */
  RULR_ENGINE = 'rule-engine',
  /** 下载中登附件 */
  DOWNLOAD_REGISTERFILE = 'download_registerfile',
  /** review 用于文件补充信息页面查看 */
  REVIEW = 'review',
  /** 平台审核查看全部发票信息 */
  VIEW_INVOICE = 'view_invoice',
  /** 汇融文件问题反馈 */
  VANKE_FEEDBACK_DOCUMENT = 'vanke_feedback_document'
}
/**
 * 不同的业务类型
 */
export enum ProxyType {
  /** 老业务 */
  OLD_BUSINESS = 0,
  /** 采购融资 */
  AVENGER = 1,
  /** 龙光万科 */
  LOGIN_VANKE = 2,
  /** 碧桂园 */
  COUNTRY_GARDEN = 3,
  /** 新金地 */
  NEW_GEMDALE = 4,
  /** 雅居乐星顺 */
  AGILE_XINGSHUN = 5,
  /** 雅居乐恒泽 */
  AGILE_HZ = 6,
  /** 香纳-金地 */
  XN_GEMDALE = 7,
  /** 中晟-金地 */
  ZS_GEMDALE = 8,
  /** 香纳万科 */
  XN_VANKE = 9,
  /** 香纳龙光 */
  XN_LOGAN = 10,
  /** 博时龙光 */
  PS_LOGAN = 11,
}
/** 通用签章列表，状态 */
export enum CommonSignStatus {
  /** 待归档 */
  READY_FILED = 3,
  /** 已完成 */
  COMPLETE = 4,
}

/** 排序类型 */
export enum XnSortTypeEnum {
  /** 升序 */
  ASC = 'asc',
  /** 降序 */
  DESC = 'desc',
}
/** 媒体文件格式 */
export enum MediaFileTypeEnum {
  /** 图片 */
  IMG = 'img',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  /** PDF */
  PDF = 'pdf',
  /** 视频 */
  VIDEO = 'mp4',
  mp4 = 'mp4',
  MP4 = 'MP4',
  /** 文件 */
  WORD = 'doc',
  EXCEL = 'xls',
}

/** 待办完结状态 */
export enum RecordStatusEnum {
  /** 上银待开户状态 */
  UNSIGN = -1,
  /** 草稿 */
  NOTDO = 0,
  /** 进行中 */
  DOING = 1,
  /** 已完结 */
  FINISH = 2,
  /** 已中止 */
  STOP = 3,
}

/** 流程步骤Id */
export enum ProcduresIdEnum {
  /** 开始Id */
  BEGIN = '@begin',
  /** 结束Id */
  END = '@end',
  /** 经办 */
  OPERATE = 'operate',
  /** 复核 */
  REVIEW = 'review',
  /** 复核 */
  CUSTOMER_OPERATOR = 'customerOperator',
  /** 系统 */
  SYSTEM = 'system',
  /** 上海银行退回 */
  SHBANK = 'shbank',
}

/** 机构类型枚举 */
export enum OrgTypeEnum {
  /** 供应商 */
  SUPPLIER = 1,
  /** 保理商 */
  FACTORING = 3,
  /** 银行 */
  BANK = 4,
  /** 风控平台 */
  RISK_CONTROL_PLATFORM = 88,
  /** 平台 */
  PLATFORM = 99,
  /** 项目公司 */
  PROJECT_COMPANY = 201,
  /** 总部公司 */
  HEADQUARTERS_COMPANY = 202,
  /** 中介机构 */
  AGENCY = 102,
}

/** 请求响应的状态码 */
export enum RetCodeEnum {
  /** 成功: 0 */
  OK = 0,
  /** 失败: 1 */
  FAIL = 1,
  /** 系统错误 */
  SYSTEM_FAIL = 2,
  /** 读取文件失败 */
  READ_FILE_FAIL = 3,
  /** 写入文件失败 */
  WRITE_FILE_FAIL = 4,
  /** 生成目录失败 */
  MAKE_DIR_FAIL = 5,
  /** 移动文件失败 */
  MOVE_FILE_FAIL = 6,
  /** 不是字符串 */
  IS_NOT_STRING = 7,
  /** 无效的系统文件名 */
  INVALID_SYSTEM_FILENAME = 8,
  /** 无效的存贮类型 */
  INVALID_STORE_TYPE = 9,
  /** 是一个空白字符串 */
  IS_SPACE_STRING = 10,
  /** 是一个空字符串 */
  IS_EMPTY_STRING = 11,
  /** 文件不存在 */
  FILE_NOT_EXISTS = 12,
  /** 继续 */
  CONTINUE = 13,
  /** 平台复合提交数据变动回退 */
  VANKE_BACK = 999,
  /** 无效的PID */
  INVALID_PID = 100,
  /** 无效的EnvId */
  INVALID_ENVID = 101,
  /** 无效的文件类型 */
  INVALID_FILE_TYPE = 102,
  /** 完效的PID_ENVID_TYPE */
  INVALID_PID_ENVID_TYPE = 103,
  /** 无效的顺序 */
  INVALID_SEQ = 104,
  /** 无效的app信息 */
  INVALID_APP_INFO = 105,
  /** 未发现企业的开票信息 */
  INVALID_TAX_INFO = 106,

  // 现有链融平台已经用到的错误码
  /** 系统内部错误，请稍后再试:99901  */
  LR_SYSTEM_FAIL = 99901,
  /** 请登录:99902  */
  LR_NOT_LOGIN = 99902,
  /** 参数错误或缺少参数:99903  */
  LR_PARAMS = 99903,
  /** 客户经理不存在，需要平台管理员设置该企业的客户经理 */
  LR_NO_CLIENT_MANAGER = 99904,
  /** 未知的文件类型 */
  LR_UNKNOW_FILE_TYPE = 99905,
  /** 未没有找到file_data的文件 */
  LR_NOT_FOUND_FILE = 99906,
  /** 文件类型，不是图片 */
  LR_FILE_CONTENT_NOT_IMG = 99907,
  /** 当前角色没有权限:10111  */
  LR_ROLE_ACCESS = 10111,
  /** 万科数据请求失败:20000  */
  VANKE_QUERY_FAIL = 20000,
  /** 缺少cookie参数:20001  */
  LR_NOT_FIND_PARAMS_COOKIE = 20001,
  /** 请求风控数据失败:20002  */
  LR_NOT_GET_FK_DATA = 20002,

  // 采购融资业务返回错误码范围
  AVENGER_BEGIN = 10000001,

  /** 未找到mainFlowId的对应记录 */
  MAINFLOW_NOT_EXIST = 10000001,
  /** 交易对应的模式配置不存在 */
  MAINFLOW_MODEL_CONFIG_NOT_EXIST = 10000002,
  /** 未找到FlowId对应的流程 */
  FLOW_NOT_EXIST = 10000003,
  /** 当前角色没有足够的权限 */
  FLOW_NOT_ENOUGH_RIGHT = 10000004,
  /** 没有下一个步骤 */
  NOT_FOUND_NEXT_PROCDURE = 10000005,
  /** 在FlowRecord中没有找到指定的记录 */
  NOT_FOUND_FLOW_RECORD = 10000006,
  /** 步骤id不一致 */
  PROCDURE_NOT_EQU = 10000007,
  /** 流程已经结束了 */
  FLOW_IS_CLOSE = 10000008,
  /** 没有找到FlowRecord对应的Log */
  NOT_FOUND_FLOW_ERCORD_LOG = 10000009,
  /** 未找到RecordId对应的流程 */
  RECORD_NOT_EXIST = 10000110,
  /** 流程已经完成无法处理 */
  RECORD_FINISH = 10000111,
  /** 找不到该步骤 */
  PROCEDURE_NOT_FOUND = 10000112,
  /** 找不到下一步骤 */
  NEXTPROCEDURE_NOT_FOUND = 10000113,
  /** 不能回退 */
  CAN_NOT_REJECT = 10000114,
  /** 记录被中止了 */
  BEEN_STOPED = 10000115,
  /** 这个客户资料已经存在 */
  JD_CUSTOMER_IS_EXIST = 10000115,
  /** 存在有问题的交易ID */
  HAS_ERROR_MAIN_FLOW_ID = 10000116,
  /** 没有推送过的审批放款记录 */
  APPROVAL_NOT_PUSH = 10000117,
  /** 合同处于未签署状态 */
  NOT_SIGN_CONTRACT = 10000118,
  /** 存在不同交易类型的交易 */
  NOT_TRADE_EQU_TYPE_LIST = 10000119,
  /** 不支持的业务类型  */
  NOT_SUPPORT_TRADE = 10000120,

  DRAGON_END = 40000000,
  // 业务通用错误码
  COMMON_BEGIN = 1000000,
  /** 未登陆 */
  UN_LOGIN = 1000001,
  /** 无效时间戳  */
  INVALID_TIMESTAMP = 1000002,
  /** 签名错误 */
  SIGN = 1000003,
  COMMON_END = 10000000,

  // 系统相关错误  1000-9999
  /** 参数错误 */
  PARAM = 1000,
  /** 参数为null */
  PARAM_IS_NULL = 1001,

  /**
   * CFCA
   */
  /** 获取签署配置失败 */
  CA_GET_CONFIG_FAIL = 70020,
  /** 错误的签署配置 */
  CA_CONFIG_FAIL = 70021,
  /** 获取合同信息异常，请重新生成合同进行签署 */
  CA_GET_CONTRACTINFO_FAIL = 70022,
  /** 该合同已签署，请勿重复签署 */
  CA_CONTRACT_IS_SIGN = 70023,
  /** 获取项目编号失败 */
  CA_GET_PROJECTCODE_FAIL = 70024,
  /** 获取开户信息失败 */
  CA_GET_ACCOUNT_FAIL = 70025,
  /** 签署合同失败 */
  CA_SIGN_FAIL = 70026,
  /** 获取合同文件失败 */
  CA_GET_PDF_FAIL = 70027,
  /** 文件存储异常 */
  CA_SET_PDF_FAIL = 70028,
  /** 获取合同关键字异常 */
  CA_GET_KEYWORD_FAIL = 70030,
  /** 合同未签署完成，请检查 */
  CA_ALL_NOT_SIGN = 70031,

  /** 数据不存在 */
  NOT_FOUND_DATA = 70050,
  /** 线上电子章的签署不允许核销 */
  CA_NOT_SIGNTYPE_ONLINE = 70051,
  /** 非待归档的签署不允许核销 */
  CA_NOT_SIGNTYPE_ARCHIVED = 70052,
  /** 当前状态不允许终止 */
  CA_NOT_SIGNTYPE_DEL = 70053,

  /**
   * JD
   */
  /** 获取融资数据变动异常 */
  JD_GET_CHANGE_NUMBER_FAIL = 80001,
  /** 金地单次下载相关文件最大数量 */
  JD_DOWNLOAD_MAX_COUNT = 80002,
  /** 金地文件下载参数异常 */
  JD_DOWNLOAD_PARAM = 80003,
  /** 金地文件下载参数异常 */
  JD_DOWNLOAD_FAIL = 80004,
  /** 指定的id的金地对接数据id不存在 */
  JD_BILL_NOT_EXISTS = 80005,
  /** 应收账款金额不一致 */
  JD_BILL_NOT_CHANGE = 80006,
  /** 增加任务失败 */
  JD_BILL_ADD_TASK_FAIL = 80007,
  /** 未上传履约证明文件 */
  NO_UPLOAD_PERFORMANCE = 88888,
}

export enum EnterZdType {
  /** 从中登查询页面进入批量查询记录 */
  ZD_SEARCH = 1,
  /** 从中登跟新页面进入批量查询记录 */
  ZD_UPDATE = 2,
}

/** 中登数据状态 */
export enum ZDRecordStatus {
  /** 在途 */
  IN_PROCESS = 1,
}
/** 中登数据类别 */
export enum zdType {
  'invoice' = '发票',
  'contract' = '合同',
  'debtor' = '债务人',
}

/** 审核人员类型枚举 */
export enum AuditorTypeEnum {
  /** 管理员 */
  ADMIN = 'admin',
  /** 经办人 */
  OPERATOR = 'operator',
  /** 复核人 */
  REVIEWER = 'reviewer',
  /** 系统 */
  SYSTEM = 'system',
  /** 客户经理经办人 */
  CUSTOMER_OPERATOR = 'customerOperator',
  /** 客户经理复核人 */
  CUSTOMER_REVIEWER = 'customerReviewer',
  /** 风险审查经办人 */
  RISK_OPERATOR = 'riskOperator',
  /** 风险审查复核人 */
  RISK_REVIEWER = 'riskReviewer',
  /** 财务经办人 */
  FINANCE_OPERATOR = 'financeOperator',
  /** 财务复核人 */
  FINANCE_REVIEWER = 'financeReviewer',
  /** 高管经办人 */
  WIND_OPERATOR = 'windOperator',
  /** 高管复核人 */
  WIND_REVIEWER = 'windReviewer',
  /** 查看权限 */
  CHECKER_LIMIT = 'checkerLimit',
  /** 查看权限 */
  HOTLINE = 'hotline',
  /** 查看权限 */
  PORTAL = 'portal',
  /** 查看权限 */
  LOANED = 'loaned',
}

/** 各产品对应的proxyType值枚举 */
export enum ProxyTypeEnum {
  /** CONSOLE */
  CONSOLE = 0,
  /** AVENGER */
  AVENGER = 1,
  /** VANKE&LOGAN */
  VANKE_LOGAN = 2,
  /** 碧桂园星顺 */
  COUNTRY_GRADEN = 3,
  /** 金地 */
  NEW_GEMDALE = 4,
  /** 雅居乐星顺 */
  AGILE_XINGSHUN = 5,
  /** 雅居乐恒泽 */
  AGILE_HZ = 6,
  /** 香纳金地 */
  XN_GEMDALE = 7,
  /** 中晟金地 */
  ZS_GEMDALE = 8,
  /** 香纳万科 */
  XNVANKE = 9,
  /** 香纳龙光 */
  XNLOGAN = 10,
  /** 博时资本-龙光 */
  PSLOGAN = 11,
  /** 成都轨交 */
  ABS_GJ = 12,
}
/** pre融资业务标识 */
export enum IsPreTrade {
  NO = 0,
  YES = 1,
  UNKNOW = 2,
}

export enum ZdStatus {
  /** 登记中 */
  REGISTER_PROGRESS = 1,
  /**登记失败 */
  REGISTER_FAIL = 2,
  /**完成登记 */
  REGISTER_COMPLETE = 3,
  /**撤销登记*/
  REGISTER_CANCEL = 4,
  /**待登记 */
  REGISTER_READY = 5,
  /** 已变更 */
  REGISTER_CHANGED = 6,
  /**变更中 */
  REGISTER_CHANING = 7,
  /**已注销 */
  REGISTER_OFF = 8,
}

/** 中登查询状态枚举 */
export enum ZdSearchStatusEnum {
  /** 查询未开始 */
  UN_START = 0,
  /** 查询中 */
  QUERYING = 1,
  /** 查询完成 */
  SUCCESS = 2,
  /** 查询超时被取消 */
  CANCEL = 3,
  /** 查询失败 */
  FAILURE = 4,
}

/** 分步流程是否需要审核 */
export enum StepOperateTypeEnum {
  /** 不需要审核 */
  NO_CHECK = '0',
  /** 需要审核 */
  NEED_CHECK = '1',
}

/** 分步流程审核状态枚举 */
export enum StepResultStatusEnum {
  /** 默认状态 */
  NONE = 0,
  /** 审核通过 */
  PASS = 1,
  /** 审核不通过 */
  NO_PASS = 2,
}
/** 分步流程调用规则引擎状态信息 */
export enum StepRuleStatusEnum {
  /** 异常 */
  FAIL,
  /** 通过 */
  PASS,
  /** 不展示 */
  NO_SHOW = -1,
}
/** 文件分类-合同类型枚举 */
export enum FileNatureChildOptionEnum {
  HT_PROJECT = 'ht_project', // 工程类
  FK_PROJECT = 'fk_project', // 付款工程类
  HT_TRADE = 'ht_trade', // 贸易类
  FK_TRADE = 'fk_trade', // 付款贸易类
  HT_SERVICE = 'ht_service', // 服务类
  FK_SERVICE = 'fk_service', // 付款服务类
  ONLINE_ORDER = 'online_order', // 线上订单
}

export enum xnInvoiceStatus {
  /** 未验证 */
  CHECK_SUCCESS = 1,
  /** 验证成功 */
  CHECK_FAIL = 2,
  /** 重复验证 */
  CHECK_MORE = 3,
  /** 已作废 */
  CHECK_QUIT = 4,
  /** 未验证 */
  NO_CHECK = 5,
  /** 失控 */
  OUT_CONTROL = 6,
  /** 红冲 */
  HONG_CHONG = 7,
  /** 异常票状态 */
  ABNOMAL_STATUS = 8,
}

/** 万科提单数据来源 */
export enum VankeDataSourceEnum {
  /** 线上 */
  ON_LINE = 1,
  /** 线下 */
  UNDER_LINE = 0,
}

/** 风险审核冻结状态 */
export enum RiskFreezeStatusEnum {
  /** 冻结 */
  FREEZE = 1,
  /** 未冻结 */
  UNFREEZE = 0,
}

/** 台账交易状态 */
export enum LedgerTradeStatus {
  /** 中止/退单 */
  Unusual = 99,
}

/** 台账交易异常状态 */
export enum LedgeReTradeStatus {
  /** 中止 */
  Suspend = 0,
  /** 退单 */
  Chargeback = 4,
}

/** 产品渠道类型 */
export enum ChannelTypeEnum {
  /** 未发起 */
  None = 0,
  /** ABS类型 */
  AbsStatus = 1,
  /** 再保理银行 */
  FactoringStatus = 2,
  /** 银行直保 */
  BankStatus = 3,
  /** ABN */
  AbnStatus = 4,
  /** 非标 */
  NoNormal = 99,
}

/** 渠道资金方类型 */
export enum FunderTypeEnum {
  /** 没有银行 */
  NONE = 0,
  /** 光大 */
  BANK_GD = 1,
  /** 招行 */
  BANK_ZH = 2,
  /** 邮储 */
  BANK_YC = 3,
  /** 农行 */
  BANK_NH = 4,
  /** 国寿财富 */
  BANK_GS = 5,
  /** 上海银行 上海银行股份有限公司深圳分行 */
  BANK_SHANGHAI = 6,
  /** 北京银行 */
  BANK_BEIJING = 7,
  /** 浦发银行 */
  BANK_PUFA = 8,
  /** 博时资本-非标 */
  BANK_BOSHI = 9,
  /** 东亚 */
  BANK_DY = 10,
  /** 万科工行 */
  VANKE_GH = 11,
  /** 金地工行 */
  BANK_GH = 12,
  /** 民生银行 */
  BANK_MS = 13,
}
export enum HasPerformanceEnum {
  /** 没有履约证明 */
  NONE = 0,
  /** 生成了履约证明，但没盖章 */
  YES = 1,
  /** 生成了已盖章的履约证明 */
  YES_SIGN = 2,
}

/** 注册渠道枚举 */
export enum ChannelEnum {
  /** 农交所 */
  农交所 = 'LJS',
  链融平台 = 'LR',
}

/** 合同管理是否是一次转让合同组，还是二组转让合同组 */
export enum ContractManagerEnum {
  ONCE_CONTRACT_MANAGE = 0,
  SECOND_CONTRACT_MANAGE = 1,
}

/** 文件预览旋转方向  */
export enum FileRotateTypeEnum {
  /** 左旋 */
  LEFT = 'left',
  /** 右旋 */
  RIGHT = 'right',
}

/** 文件预览缩放类型  */
export enum FileScaleTypeEnum {
  /** 放大 */
  LARGE = 'large',
  /** 缩小 */
  SMALL = 'small',
}

/** 上海银行流程  */
export enum ShVankeFlowIdEnum {
  /** 保理商预录入 */
  ShVankeFinancingPre = "sh_vanke_financing_pre",
  /** 供应商上传资料 */
  ShVankeFinancing = "sh_vanke_financing",
  /** 待平台审核 */
  ShVankePlatformVerify = "sh_vanke_platform_verify",
  /** 待上银复核 */
  ShVankeBankVerify = 'sh_vanke_bank_verify',
  /** 待供应商签署合同 */
  ShVankeFinancingSign = 'sh_vanke_financing_sign',
  /** 上海银行，退单 */
  SubShPlatformCheckRetreat = 'sub_sh_platform_check_retreat',
}

export enum OperateCertifyEnum{
    /**录入操作 */
  ENTER=1,
  /**查看操作 */
  VIEW=2,

}
