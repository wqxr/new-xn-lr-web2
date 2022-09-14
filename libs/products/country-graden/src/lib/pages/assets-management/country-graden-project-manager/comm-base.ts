import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

export default class CommBase {

    private com: any;
    public xn: XnService;
    superConfig: any;
    api: any;

    constructor(com: CommonPage, superConfig: any) {
        this.com = com;
        this.xn = this.com.xn;
        this.superConfig = superConfig;
        this.api = this.xn.api;
    }

    // ====================================================

    /**
     * 生成detail请求的参数
     * @param params
     */
    buildDetailParams(params) {
        const ret = {} as any;
        for (const key of this.superConfig.keys) {
            ret[key] = params[key];
        }
        return ret;
    }

    /**
     * 按keys拼装出key url
     * @param params
     */
    buildKeyUrl(params): string {
        return this.superConfig.keys.map(key => '/' + params[key]).join();
    }

    // ====================================================

    canAdd(): boolean {
        const conf = this.superConfig;
        return conf.add && conf.add.can && conf.add.can(this.xn);
    }

    canDetail(record): boolean {
        // 只要存在detail配置就允许查看详情
        return this.superConfig.detail;
    }

    canEdit(record): boolean {
        const conf = this.superConfig;
        return conf.edit && conf.edit.can && conf.edit.can(this.xn, record);
    }

    // ====================================================

    onList(params) {
        if (this.superConfig.list && this.superConfig.list.onList) {
            this.superConfig.list.onList(this, params);
        } else {
            this.onDefaultList(params);
        }
    }

    refresh() {
        this.onDefaultList({});
    }

    onDefaultList(params) {
        const url = `${this.superConfig.apiUrlBase}${this.superConfig.immutableUrl || ''}`;
        this.xn.api.dragon.post(url, params).subscribe(json => {
            this.com.total = json.data.count;
            this.com.rows = json.data.data;
        });
    }

    setRows(data) {
        this.com.rows = data;
    }

    onMoreList(params) {
        this.xn.api.dragon.post(this.superConfig.apiUrlBase, params).subscribe(json => {
            for (const item of json.data.data) {
                this.com.rows.push(item);
            }
            this.com.start = json.data && json.data.start;
            this.com.count = json.data && json.data.count;
            this.com.showBtn = this.com.start >= this.com.count ? false : true;
        });
    }

    onMore(start, beginTime, endTime) {
        this.onMoreList({
            start: start || 0,
            beginTime,
            endTime,
        });
    }

    onReturnArrays(params, title) {
        this.xn.api.dragon.post(this.superConfig.apiUrlBase, params).subscribe(json => {
            const arr = json.data.map(v => {
                return {
                    title: v
                };
            });
            this.com.rows = arr;
        });
    }

    spliceItem(v) {
        if (v.billAmounts <= v.invoiceAmounts) {
            for (let i = 0; i < this.com.rows.length; i++) {
                if (this.com.rows[i].mainFlowId === v.mainFlowId) {
                    this.com.rows.splice(i, 1);
                }
            }
        } else {
            this.com.rows.toString();
        }
    }

    onDetail() {
        if (this.superConfig.detail && this.superConfig.detail.onDetail) {
            this.superConfig.detail.onDetail(this, this.com.params);
        } else {
            this.onDefaultDetail(this.com.params);
        }
    }

    onDefaultDetail(params) {
        this.xn.api.dragon.post(this.superConfig.apiUrlBase + '?method=detail', {
            where: this.buildDetailParams(params)
        }).subscribe(json => {
            this.buildRows(json.data);
        });
    }

    onListDetail(params) {
        this.xn.api.dragon.post(this.superConfig.apiUrlDetail + '?method=detail', {
            where: this.buildDetailParams(params)
        }).subscribe(json => {
            this.buildRows(json.data);
        });
    }

    onListDetailJson(params) {
        this.xn.api.dragon.post(this.superConfig.apiUrlDetail, this.buildDetailParams(params)
        ).subscribe(json => {
            this.buildRows(json.data);
        });
    }

    onSubmitEdit() {
        if (this.superConfig.edit && this.superConfig.edit.onSubmit) {
            this.superConfig.edit.onSubmit(this);
        } else {
            this.onDefaultSubmitEdit();
        }
    }

    onDefaultSubmitEdit() {
        const params = {} as any;
        for (const key of Object.keys(this.com.mainForm.value)) {
            params[key] = this.com.mainForm.value[key];
        }

        // 对key的赋值要在form赋值之后，避免form的错误值修改了key
        for (const key of this.superConfig.keys) {
            params[key] = this.com.params[key];
        }

        this.xn.api.dragon.post(this.superConfig.apiUrlBase + '?method=put', {
            where: this.buildDetailParams(this.com.params),
            value: params
        }).subscribe(json => {
            this.xn.msgBox.open(false, this.superConfig.showName + '已修改成功', () => {
                this.xn.user.navigateBack();
            });
        });
    }

    onSubmitAdd() {
        if (this.superConfig.add && this.superConfig.add.onSubmit) {
            this.superConfig.add.onSubmit(this);
        } else {
            this.onDefaultSubmitAdd();
        }
    }

    onDefaultSubmitAdd() {
        this.xn.api.dragon.post(this.superConfig.apiUrlBase + '?method=post', {
            value: this.com.mainForm.value
        }).subscribe(json => {
            this.xn.msgBox.open(false, this.superConfig.showName + '已添加成功', () => {
                this.xn.user.navigateBack();
            });
        });
    }

    // ====================================================

    onNavigateAdd(): void {
        this.xn.router.navigate([this.superConfig.webUrlBase + 'add']);
    }

    onNavigateDetail(record): void {
        this.xn.router.navigate([this.superConfig.webUrlBase
            + 'detail'
            + this.buildKeyUrl(record)]);
    }

    onNavigateEdit(record): void {
        this.xn.router.navigate([this.superConfig.webUrlBase
            + 'edit/'
            + this.buildKeyUrl(record)]);
    }

    // ====================================================

    buildRows(data) {
        this.com.record = data;
        const isEdit = this.com.type === PageTypes.Edit; // 两种情况下稍有区别
        // const isEdit = true;
        const fields = isEdit ? CommUtils.getEditFields(this.superConfig.fields) : CommUtils.getDetailFields(this.superConfig.fields);
        this.com.rows = fields.map(field => {
            const n: any = {} as any;
            if (isEdit) {
                n.value = data[field.checkerId];
            } else {
                n.data = data[field.checkerId];
            }
            for (const key of Object.keys(field)) {
                n[key] = field[key];
            }
            return n;
        });

        if (isEdit) {
            this.buildForm(this.com.rows);
        }
    }

    buildForm(fields) {
        XnFormUtils.buildSelectOptions(fields);
        for (const row of fields) {
            XnFormUtils.convertChecker(row);
        }
        this.com.mainForm = XnFormUtils.buildFormGroup(fields);
    }


    onCancel() {
        this.xn.user.navigateBack();
    }

    // setBtn
    setBtn(bool) {
        this.com.unShowBtn = bool;
    }

    getBtn() {
        return this.com.unShowBtn;
    }

    showPage(bool) {
        this.superConfig.showPage = bool;
    }
}

// 资产池字段对应
export class CapitalPoolModel {
    public capitalPoolId?: string; // 资产池编号
    public capitalPoolName?: string; // 资产池名称
    public headquarters?: string; // 总部公司
    public storageRack?: string; // 储架
    public isProxy?: string; // 交易模式
    public financiersNumber?: number; // 供应商融资人数量
    public enterprisersNumber?: number; // 项目公司融资人数量
    public maxFinancingRatio?: number; // 最大供应商融资比例
    public maxEnterpriseRatio?: number; // 最大项目公司融资比例
    public supplierRatio?: number; // 供应商警戒比例
    public enterpriseRatio?: number; // 项目公司警戒比例
    public maxFinancingName?: string; // 最大供应商融资人名称
    public maxEnterpriseName?: string; // 最大项目公司融资人名称
    public agencyInfo?: string; // 中介机构
    public commodityTradNumber?: number; // 商品交易个数
    public serviceTradNumber?: number; // 服务交易个数
    public tradNumber?: number; // 交易个数
    public isLocking?: number; // 是否锁定 1: 锁定 0：未锁定
}

/** 合同生成类型
* - 类型值大于1000的是要签属合同的
* - 类型值小于1000的是不需要签属合同的
*/
export enum ContractCreateType {
   /** 《总部公司回执（二次转让）》 */
   CodeReceipt2 = 1,
   /** 《项目公司回执（二次转让）》 */
   CodeProjectReceipt2 = 2,
   /** 项目公司回执（一次转让）》 */
   CodeProjectReceipt1 = 3,
   /** 《付款确认书（总部致券商）》 */
   CodeBrokerPayConfirm = 4,
   /** 《付款确认书（总部致保理商）》 */
   CodeFactoringPayConfirm = 5,
   /** 《致总部公司通知书（二次转让）》 */
   CodeNotice2 = 1001,
   /** 《致项目公司通知书（二次转让）》 */
   CodeProjectNotice2 = 1002,
   /** 《债权转让及账户变更通知的补充说明 */
   CodeChangeNoticeAdd = 1003,
}

/**
* 龙光-二次转让合同生成类型
* - 类型值大于1000的是要签属合同的
* - 类型值小于1000的是不需要签属合同的
*/
export enum DragonContractCreateType {
   /** 总部回执（二次转让）-龙光 */
   second_lg_09 = 1,
   /** 项目公司回执（二次转让）-龙光 */
   second_lg_07 = 2,
   /** 项目公司回执（一次转让）-龙光 */
   second_lg_05 = 3,
   /** 付款确认书（总部致券商）-龙光 */
   second_lg_11 = 4,
   /** 付款确认书（总部致保理商）-龙光 */
   second_lg_10 = 5,

   /** 致总部通知书（二次转让）-龙光 */
   second_lg_08 = 1001,
   /** 致项目公司通知书（二次转让）-龙光 */
   second_lg_06 = 1002,
   /** 债权转让及账户变更通知的补充说明-龙光 */
   second_lg_add_03 = 1003,
}

/** 范围 */
export enum SelectRange {
   /** 当前条件筛选下所有交易 */
   All = 1,
   /** 当前勾选的交易 */
   Select = 2,
   /** 仅抽样业务 */
   Sample = 3,
}

/** 下载附件方式 */
export enum DownloadType {
   /** 分不同文件夹 */
   DifferentFolder = 1,
   /** 放在同一文件夹 */
   SameFolder = 2
}

/** 新旧资产池 新-项目管理模块 旧-地产abs下资产池 */
export enum CapitalType {
   /** 新-项目管理模块 */
   New = 1,
   /** 旧-地产abs下资产池 */
   Old = 2
}

export enum DragonContentType {
   /** 《致总部公司通知书（二次转让）》 */
   CodeNotice2 = 1,
   /** 《总部公司回执（二次转让）》 */
   CodeReceipt2 = 2,
   /** 《致项目公司通知书（二次转让）》 */
   CodeProjectNotice2 = 3,
   /** 《项目公司回执（二次转让）》 */
   CodeProjectReceipt2 = 4,
   /** 项目公司回执（一次转让）》 */
   CodeProjectReceipt1 = 5,
   /** 《付款确认书（总部致券商）》 */
   CodeBrokerPayConfirm = 6,
   /** 《付款确认书（总部致保理商）》 */
   CodeFactoringPayConfirm = 7,
   /** 一次转让签署的合同文件 */
   CodeAssignment = 8,
   /** 中登登记证明文件 */
   CodeCertificate = 9,
   /** 查询证明文件 */
   CodeSearcherCertificate = 10,
   /** 基础资料 */
   CodeBaseResource = 11,
   /**<<债权转让及账户变更通知的补充说明>> */
   CodeCreditAccountChange = 12,
   /**<<放款回单>> */
   LoanReceipt = 13,
}
