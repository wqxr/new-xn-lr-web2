// 银行授信
export class BankCreditOutputModel {
    referenceId: string; // '银行授信调查ID',
    orgName: string; // '机构名称，必须是全称',
    status: string; // '本条记录的状态(0=无效，1=有效)',
    inYear: string; // '年份',
    creditBank: string; // '授信行',
    grade: string; // '评级',
    creditType: string; // '授信种类',
    creditLimit: any; // '授信额度（万元）',
    creditUsed: any; // '使用额度（万元）',
    selected?: boolean;
}

export class InfoOutputModel {
    referee: RefereeOutputModel[];
    courtNotice: CourtNoticeOutputModel[];
    opening: OpeningOutputModel[];
    refereeTotal: number;
    courtNoticeTotal: number;
    openingTotal: number;
    refereeCurrentPage: number;
    openingCurrentPage: number;
    courtNoticeCurrentPage: number;
}

// 裁判文书
export class RefereeOutputModel {
    Id: string; // Id
    Court: string; // 执行法院
    CaseName: string; // 裁判文书名字
    CaseNo: string; // 裁判文书编号
    CaseType: string; // 裁判文书类型
    SubmitDate: string;  // 发布时间
    UpdateDate: string; // 审判时间
    IsProsecutor: string; // 是否原告
    IsDefendant: string; // 是否被告
    CourtYear: string; // 开庭时间年份
    CaseRole: string; // 案人员角色
}

// 裁判文书-详情
export class RefereeDetailOutputModel {
    Id: string; // Id
    CaseName: string; // 裁判文书名字
    CaseNo: string; // 裁判文书编号
    CaseType: string; // 裁判文书类型
    CaseTypeCode: string; // 裁判文书类型编号
    Content: string; // 裁判文书内容
    Court: string; // 执行法院
    CreateDate: string; // 创建时间
    SubmitDate: string; // 提交时间
    UpdateDate: string; // 修改时间
    Appellor: string[]; // 当事人
    JudgeDate: string; // 裁判时间
    CaseReason: string; // 案由
    TrialRound: string; // 审理程序
    Defendantlist: string[]; // 被告
    Prosecutorlist: string[]; // 原告
}

// 开庭公告
export class OpeningOutputModel {
    Defendantlist: any; // 被告/被上诉人
    Executegov: string; // 法院
    Prosecutorlist: any; // 原告/上诉人
    LianDate: string; // 开庭日期
    CaseReason: string; // 案由
    Id: string; // 内部ID
    CaseNo: string; // 案号
}

// 开庭公告-详情
export class OpeningDetailOutputModel {
    Province: string; // 省份
    Case_Reason: string; // 案由
    Schedule_Time: string; // 排期日期
    Execute_Gov: string; // 法院
    Undertake_Department: string; // 承办部门
    Execute_Unite: string; // 法庭
    Chief_Judge: string; // 审判长/主审人
    Open_Time: string; // 开庭日期
    Case_No: string; // 案号
    Prosecutor: Model[];	//  ;公诉人/原告/上诉人/申请人
    Defendant: Model[];	//  ;	被告/被告人/被上诉人/被申请人
    Content: string; // 公告内容
}

export class Model {
    Name: string;
    KeyNo: string;
}

// 法院公告
export class CourtNoticeOutputModel {
    UploadDate: string; // 下载时间
    Court: string; // 执行法院
    Content: string; // 内容
    Category: string; // 种类
    PublishedDate: string; // 公布日期
    PublishedPage: string; // 公布、页
    Party: string; // 公司名、当事人
    Id: string; // 主键
}

// 法院公告-详情
export class CourtNoticeDetailOutputModel {
    Court: string; // 公告法院
    Content: string; // 内容
    SubmitDate: string; // 上传日期
    Province: string; // 所在省份代码
    Category: string; // 类别
    PublishDate: string; // 刊登日期
    PublishBroad: string; // 刊登日期
    Party: string; // 当事人
    NameKeyNoCollection: Model[]; //  当事人信息
}

// 法人机构详情字段
export class InfoDetailOutputModel {
    referee: RefereeDetailOutputModel = new RefereeDetailOutputModel();
    courtNotice: CourtNoticeDetailOutputModel = new CourtNoticeDetailOutputModel();
    opening: OpeningDetailOutputModel = new OpeningDetailOutputModel();
}
