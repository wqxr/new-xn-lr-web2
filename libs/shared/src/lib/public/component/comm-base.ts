import CommUtils from './comm-utils';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnService } from '../../services/xn.service';
import { CommonPage, PageTypes } from './comm-page';

export default class CommBase {

    private com: any;
    public xn: XnService;
    superConfig: any;
    api: any;

    constructor(com: CommonPage, superConfig: any) {
        this.com = com;
        this.xn = this.com.xn;
        this.superConfig = superConfig;
        this.api = superConfig.isAvengerBusiness ? this.xn.avenger : this.xn.api;
        // 有产品标识productIdent,则调用新待办接口
        this.api = superConfig?.productIdent ? this.xn.dragon : this.api;
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
        // 产品标识,产品id或者待办类别
        params.productIdent = this.superConfig?.productIdent;
        const url = `${this.superConfig.apiUrlBase}${this.superConfig.immutableUrl ? '' : '?method=get'}`;
        this.api.post(url, params).subscribe(json => {
            this.com.total = json.data.recordsTotal || json.data.count;
            this.com.rows = json.data.data;
            if (this.superConfig.type === 'sysMsgTodo' && params.status === 0) { // 将系统未读消息数量广播出去
                this.xn.user.updateTodoSysMsg(json.data.recordsTotal);
            }
        });
    }

    setRows(data) {
        this.com.rows = data;
    }

    onMoreList(params) {
        this.api.post(this.superConfig.apiUrlBase + '?method=get', params).subscribe(json => {
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
        this.api.post(this.superConfig.apiUrlBase + '?method=get', params).subscribe(json => {
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
        this.api.post(this.superConfig.apiUrlBase + '?method=detail', {
            where: this.buildDetailParams(params)
        }).subscribe(json => {
            this.buildRows(json.data);
        });
    }

    onListDetail(params) {
        this.api.post(this.superConfig.apiUrlDetail + '?method=detail', {
            where: this.buildDetailParams(params)
        }).subscribe(json => {
            this.buildRows(json.data);
        });
    }

    onListDetailJson(params) {
        this.api.post(this.superConfig.apiUrlDetail, this.buildDetailParams(params)
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

        this.api.post(this.superConfig.apiUrlBase + '?method=put', {
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
        this.api.post(this.superConfig.apiUrlBase + '?method=post', {
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

    // // 新增审核机构
    // authAdd() {

    // }
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
