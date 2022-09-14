// 交易对手
export class OpponentOutputModel {
    upStream: StreamOutputModel[] = [];
    downStream: StreamOutputModel[] = [];
    link: LinkOutputModel[] = [];
}

export class OpponentInputModel {
    upStream: StreamOutputModel = new StreamOutputModel();
    downStream: StreamOutputModel = new StreamOutputModel();
    link: LinkOutputModel = new LinkOutputModel();
}

export class StreamOutputModel {
    orgName: string; // '本企业名称',
    companyName: string; // '企业名称',
    registerMoney: string; // '注册资本',
    managementForms: string; // '经营状态',
    tradeProportion: string; // '交易比重',
    establishmentDate: string; // '成立日期',
    compayType: string; // '公司类型',
    industryInvolved: string; // '所属行业',
    areaInvolved: string; // '所属地区',
    mainProduct: string; // '主要产品',
    createTime: string;
    updateTime: string;
    bigCustomerId: string; // id
}


export class LinkOutputModel {
    relatedTransactionId: string;
    orgName: string; //  '本企业名称',
    companyName: string; //  '企业名称',
    dealCounts: string; // '交易笔数',
    dealMoney: string; // '交易金额',
    tradeProportion: string; // '一年内交易比重',
    createTime: string;
    updateTime: string;

}
