/**
 * 推介涵字段
 */
export class FactoringBusinessModel {
    public maxAmount: number; // 最大额度
    public factoringUseFLV: number; // 保理使用费
    public factoringServiceFLV: number; // 保理服务费
    public platformServiceFLV: number; // 平台费率
    public nowlimit: number; // 用款周期/保理业务期限
    public customerName: string; // 客户名称
    public customerManager: string; // 客户经理
    public contact: string; // 联系方式
    public time: any; // 推介涵时间
    public useAmount: number; // 已使用保理额度
    public allAmount: number; // 保理累计交易金额
    public backAmount: number; // 保理累计已还金额
    public allLeftAoumnt: number; // 保理累计交易金额
    public oldReceive: number; // 保理累计已还金额
    public leftAmount: number;
    public totalFLV: number;
    public userName: string;
    public mobile: string;
    constructor() {
        // this.maxAmount = 0;
        // this.factoringUseFLV = 6.4;
        // this.factoringServiceFLV = 1.5;
        // this.platformServiceFLV = 1.5;
        // this.nowlimit = 34;
        // this.customerName = '深圳搏击俱乐部';
        // this.customerManager = '刘强东';
        // this.contact = '15988888888';
        // this.time = new Date().getTime();
        // this.useAmount = 350000;
        // this.backAmount = 23665548;
        // this.allAmount = 5655555;
        // this.allLeftAoumnt = 8999999;
        // this.oldReceive = 2566555;
        // this.leftAmount = 4234;
    }
}

/**
 *  保理业务到期提醒字段
 */
export class FactoringBusinessExpirationRemindeModel {
    public mainFlowId: string; // 相关交易id
    public receiveDate: any; // 保理融资到期日
    public receive: number;  // 涉及金额
    public honorNum: string;  // 票据号码
    public supplierName: string; // 客户名称
    public upstreamName?: string; // 上游客户
    public time: number;
    public businessList?: FactoringBusinessExpirationRemindeModel[];

    constructor() {
        this.mainFlowId = '';
        this.receiveDate = new Date().getTime();
        this.receive = 0;
        this.honorNum = '';
        this.supplierName = '';
        this.upstreamName = '';
        this.time = new Date().getTime();
        this.businessList = [] = [];
    }
}
